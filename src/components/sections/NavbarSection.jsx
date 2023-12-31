import React from 'react';
import { Button, Container, Navbar } from 'react-bootstrap';
import { BsPaypal } from 'react-icons/bs';

/**
 * The bar that allows the user to navigate different parts of the app.
 */
const NavbarSection = () => {

	return (
		<header className="header_section">
			<Container fluid>
				<Navbar className='custom_nav-container' >
					<Navbar.Brand href='/CMS-Tuning-Calculator'>
						<span>
							Tuning Calculator <small className='fw-light fs-6 text-secondary text-sm-show d-none d-sm-inline'>Car Mechanic Simulator 21</small><small className='fw-light fs-6 text-secondary text-sm-show d-inline d-sm-none'>CMS 21</small>
						</span>
					</Navbar.Brand>
					<div className='w-100 text-end'>
						<Button
							href='https://paypal.me/TryphonKsydas'
							variant='secondary'
							className='btn-hover-lift d-none d-sm-inline-block'
							target='_blank'
						>
							<BsPaypal className='mb-1' /> Donate
						</Button>
						<Button
							href='https://paypal.me/TryphonKsydas'
							variant='secondary'
							className='btn-hover-lift d-inline-block d-sm-none'
							target='_blank'
							size='sm'
						>
							<BsPaypal className='mb-1' />
						</Button>
					</div>
				</Navbar>
			</Container>
		</header>
	);
};

export default NavbarSection;