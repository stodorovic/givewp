import { useLocation, Link } from 'react-router-dom';
import { Fragment } from 'react';

const { __ } = wp.i18n;

import Heading from '../../components/heading';
import Divider from '../../components/divider';
import SubscriptionReceipt from '../../components/subscription-receipt';
import SubscriptionManager from '../../components/subscription-manager';
import SubscriptionTable from '../../components/subscription-table';

import { useSelector } from './hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './style.scss';

const Content = () => {
	const subscriptions = useSelector( ( state ) => state.subscriptions );
	const querying = useSelector( ( state ) => state.querying );

	const location = useLocation();
	const route = location ? location.pathname.split( '/' )[ 2 ] : null;
	const id = location ? location.pathname.split( '/' )[ 3 ] : null;

	const getSubscriptionById = ( subscriptionId ) => {
		const filter = subscriptions.filter( ( subscription ) => parseInt( subscription.id ) === parseInt( subscriptionId ) ? true : false );
		if ( filter.length ) {
			return filter[ 0 ];
		}
		return null;
	};

	if ( id ) {
		switch ( route ) {
			case 'receipt' : {
				return querying ? (
					<Fragment>
						<Heading>
							{ __( 'Loading...', 'give' ) }
						</Heading>
						<Link to="/recurring-donations">
							{ __( 'Back to Recurring Donations', 'give' ) }
						</Link>
					</Fragment>
				) : (
					<Fragment>
						<Heading>
							{ __( 'Subscription', 'give' ) } #{ id }
						</Heading>
						<SubscriptionReceipt subscription={ getSubscriptionById( id ) } />
						<Link to="/recurring-donations">
							{ __( 'Back to Recurring Donations', 'give' ) }
						</Link>
					</Fragment>
				);
			}
			case 'manage' : {
				return querying && subscriptions === null ? (
					<Fragment>
						<Heading>
							{ __( 'Loading...', 'give' ) }
						</Heading>
						<Link to="/recurring-donations">
							{ __( 'Back to Recurring Donations', 'give' ) }
						</Link>
					</Fragment>
				) : (
					<Fragment>
						<Heading>
							{ __( 'Manage Subscription', 'give' ) } #{ id }
						</Heading>
						<Divider />
						<SubscriptionManager id={ id } subscription={ getSubscriptionById( id ) } />
						<Divider />
						<div className="give-donor-profile__recurring-donations-link">
							<Link to="/recurring-donations">
								<FontAwesomeIcon icon="arrow-left" />  { __( 'Back to Recurring Donations', 'give' ) }
							</Link>
						</div>
					</Fragment>
				);
			}
		}
	}

	return querying && subscriptions === null ? (
		<Fragment>
			<Heading>
				{ __( 'Loading...', 'give' ) }
			</Heading>
			<SubscriptionTable />
		</Fragment>
	) : (
		<Fragment>
			<Heading>
				{ `${ Object.entries( subscriptions ).length } ${ __( 'Total Subscriptions', 'give' ) }` }
			</Heading>
			<SubscriptionTable subscriptions={ subscriptions } perPage={ 5 } />
		</Fragment>
	);
};
export default Content;