'use client';

import { CalculatorContext } from '@/modules/contexts';
import {
	ChangeEvent,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { TuningPartName } from '@/@types/calculator';
import {
	ToggleSelectedPartEvent,
	UpdateSelectedPartsEvent,
	UpdateSortEvent,
} from '@/modules/customEvents';
import { PartSortBy, getCompareFn, getFullPartByName } from '@/modules/common';
import { SortBy } from '@/@types/globals';
import SortBtn from '../sortBtn/sortBtn';
import { FaTriangleExclamation } from 'react-icons/fa6';
import Link from 'next/link';

const getPartCheckboxes = () =>
	document.querySelectorAll(
		'input[data-part-checkbox]:not([disabled])',
	) as NodeListOf<HTMLInputElement>;

const getAllPartsCheckboxes = () =>
	document.querySelectorAll(
		'input[data-part-toggle-all-checkbox]',
	) as NodeListOf<HTMLInputElement>;

const markAllCheckboxes = (checked: boolean) => {
	getPartCheckboxes().forEach((checkbox) => {
		if (!checkbox.disabled) {
			checkbox.checked = checked;
		}
	});
};

const handleTogglePart = ({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
	const partName = currentTarget.dataset.partName!;
	const partQt = ~~currentTarget.dataset.partQt!;

	ToggleSelectedPartEvent.dispatch(
		{ name: partName as TuningPartName, quantity: partQt },
		currentTarget.checked,
	);
};

export default function CompatiblePartsTable() {
	const { currentEngine, selectedParts } = useContext(CalculatorContext);
	const [partMissing, setPartMissing] = useState(false);

	const [sortBy, setSortBy] = useState(PartSortBy.NameAsc);

	// onMount
	useEffect(() => {
		const handleUpdateSort = (e: Event) => {
			e.stopPropagation();
			setSortBy((e as CustomEvent<SortBy>).detail ?? PartSortBy.NameAsc);
		};

		window.addEventListener(UpdateSortEvent.name, handleUpdateSort);

		return () => {
			window.removeEventListener(UpdateSortEvent.name, handleUpdateSort);
		};
	}, []);

	// onUpdate only if selectedParts changed
	useEffect(() => {
		if (!selectedParts.length) {
			markAllCheckboxes(false);
		} else {
			getPartCheckboxes()?.forEach((checkbox) => {
				const isSelected = selectedParts.some(
					(part) => part.name === checkbox.dataset.partName,
				);

				if (checkbox.checked !== isSelected) {
					checkbox.checked = isSelected;
				}
			});
		}
	}, [selectedParts]);

	// onUpdate
	useEffect(() => {
		const elements = getPartCheckboxes();

		let allSelected = true;

		elements.forEach((elem) => {
			if (!elem.checked) {
				allSelected = false;
			}
		});

		getAllPartsCheckboxes().forEach((checkbox) => {
			checkbox.checked = allSelected;
		});
	});

	useEffect(() => {
		setPartMissing(false);
	}, [currentEngine]);

	const handleToggleAllParts = useCallback(
		({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
			if (currentTarget.checked) {
				if (currentEngine) {
					UpdateSelectedPartsEvent.dispatch(
						currentEngine.compatibleParts
							.filter((part) => !part.missing)
							.map((part) => ({
								name: part.name,
								quantity: part.quantity,
							})),
					);
				}

				markAllCheckboxes(true);
			} else {
				UpdateSelectedPartsEvent.dispatch([]);

				markAllCheckboxes(false);
			}
		},
		[currentEngine],
	);

	if (!currentEngine) return;

	const sortedCompatibleParts = currentEngine.compatibleParts.sort(
		getCompareFn(sortBy),
	);

	function MissingPartAlert() {
		if (!partMissing) return null;

		return (
			<div role="alert" className="alert alert-warning py-2 px-4 mb-4">
				<FaTriangleExclamation aria-hidden />
				<div>
					<p className="text-sm font-bold">
						Some parts are missing data! Please double check within
						the game.
						<br />
						<span className="text-xs font-normal">
							Any help filling in the missing data is welcome!{' '}
							<Link
								className="link"
								target="_blank"
								href="https://github.com/TryphonX/CMS-Tuning-Calculator/issues/new"
							>
								Open an issue on GitHub.
							</Link>
						</span>
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<MissingPartAlert />
			<div className="overflow-x-auto w-full rounded-2xl border border-base-200">
				<table className="table table-xs sm:table-sm xl:table-sm 2xl:table-sm table-zebra">
					<thead className="text-sm">
						<tr>
							<td className="w-0">
								<input
									type="checkbox"
									className="checkbox checkbox-sm 2xl:checkbox-md checkbox-primary"
									data-part-toggle-all-checkbox
									aria-label="Select all parts"
									onChange={handleToggleAllParts}
								/>
							</td>
							<th className="w-1/2 xl:w-1/3 2xl:w-1/2">
								Part{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.NameAsc,
										PartSortBy.NameDesc,
									]}
								/>
							</th>
							<th className="text-right">
								Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.BoostAsc,
										PartSortBy.BoostDesc,
									]}
								/>
							</th>
							<th className="text-right">
								Cost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.CostAsc,
										PartSortBy.CostDesc,
									]}
								/>
							</th>
							<th className="text-right max-md:hidden">
								Cost / Boost{' '}
								<SortBtn
									sortBy={sortBy}
									values={[
										PartSortBy.CostToBoostAsc,
										PartSortBy.CostToBoostDesc,
									]}
								/>
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedCompatibleParts.map((part) => {
							const tuningPartData = getFullPartByName(part.name);

							if (!tuningPartData) {
								console.warn(`Part missing: ${part.name}`);
								part.missing = true;
								if (!partMissing) {
									setPartMissing(true);
								}
							}

							return (
								<tr key={`${part.name.replace(' ', '-')}-row`}>
									<td>
										<input
											type="checkbox"
											className="checkbox checkbox-sm 2xl:checkbox-md checkbox-primary"
											data-part-checkbox
											disabled={part.missing}
											onChange={handleTogglePart}
											aria-label={`Select part ${part.name}`}
											data-part-name={part.name}
											data-part-qt={part.quantity}
										/>
									</td>
									<td
										className={
											part.missing
												? 'line-through text-secondary'
												: ''
										}
									>
										x{part.quantity} {part.name}
									</td>
									<td
										className={`text-right ${
											part.missing
												? 'line-through text-secondary'
												: ''
										}`}
									>
										+
										{(
											tuningPartData?.boost *
											part.quantity
										).toFixed(2) ?? '-'}
										%
									</td>
									<td
										className={`text-right ${
											part.missing
												? 'line-through text-secondary'
												: ''
										}`}
									>
										{tuningPartData?.cost * part.quantity}{' '}
										CR
									</td>
									<td
										className={`text-right max-md:hidden ${
											part.missing
												? 'line-through text-secondary'
												: ''
										}`}
										title={(
											tuningPartData?.cost /
											tuningPartData?.boost
										).toString()}
									>
										{(
											tuningPartData?.cost /
											tuningPartData?.boost
										)?.toFixed(0) || '-'}{' '}
										CR/Boost
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}
