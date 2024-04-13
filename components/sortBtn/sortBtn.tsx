'use client';

import { SortBy } from '@/@types/globals';
import { UpdateSortEvent } from '@/modules/customEvents';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa6';

type SortBtnProps = {
	sortBy: SortBy;
	values: [SortBy, SortBy];
};

export default function SortBtn({ sortBy, values }: SortBtnProps) {
	const handleClick = () => {
		UpdateSortEvent.dispatch(
			sortBy === (values[0] as SortBy)
				? (values[1] as SortBy)
				: (values[0] as SortBy),
		);
	};

	return (
		<button
			className={`btn btn-xs btn-square btn-ghost ${
				values.some((val) => val === sortBy) ? 'btn-active' : ''
			}`}
			onClick={handleClick}
		>
			{sortBy === values[0] ? <FaCaretUp /> : <FaCaretDown />}
		</button>
	);
}
