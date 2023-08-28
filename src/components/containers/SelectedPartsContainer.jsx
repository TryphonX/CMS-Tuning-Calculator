import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { CalculatorContext } from '../../modules/contexts';
import tuningParts from '../../modules/tuning-parts-v4.json';
import { PropTypes } from 'prop-types';

const SelectedPartsContainer = ({className}) => {

	const { selectedParts } = React.useContext(CalculatorContext);

	const totalBoost = selectedParts.reduce((sum, current) => sum + (tuningParts[current.name]?.boost * current.quantity), 0);

	const totalCost = selectedParts.reduce((sum, current) => sum + (tuningParts[current.name]?.cost * current.quantity), 0);

	const totalCostToBoost = totalBoost > 0 ? totalCost / totalBoost : 0;

	return (
		<Card className={className}>
			<Card.Header>
				<Card.Title className='mt-1'>Selected Parts</Card.Title>
			</Card.Header>
			<Card.Body>
				<Table bordered>
					<thead>
						<tr>
							<th>Name</th>
							<th>Qt</th>
							<th>Boost</th>
							<th>Cost</th>
							<th>Cost / Boost</th>
						</tr>
					</thead>
					<tbody>
						{
							selectedParts.map(part => (
								<tr key={`res-${part.name}`}>
									<td>{part.name}</td>
									<td className='text-end'>{part.quantity}</td>
									<td className='text-end'>+{tuningParts[part.name]?.boost.toFixed(2)}%</td>
									<td className='text-end'>{tuningParts[part.name]?.cost} CR</td>
									<td className='text-end'>{tuningParts[part.name]?.costToBoost} CR/Boost</td>
								</tr>
							))
						}
						<tr className='total-row'>
							<td colSpan={2}>Total:</td>
							<td className='text-end'>+{totalBoost}%</td>
							<td className='text-end'>{totalCost} CR</td>
							<td className='text-end'>{totalCostToBoost.toFixed(2)} CR/Boost</td>
						</tr>
					</tbody>
				</Table>
			</Card.Body>
		</Card>
	);
};

SelectedPartsContainer.propTypes = {
	className: PropTypes.string,
};

export default SelectedPartsContainer;