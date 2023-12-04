import {
	Component,
	OnInit,
	ViewEncapsulation
} from '@angular/core';
import { SubHeaderNavigationInterface } from '../../../common/components/shared/sub-header-navigation/sub-header-navigation.component';

interface FaqInterface {
	'question': string;
	'answer': string;
}

@Component({
	selector: 'app-club-eleven-learn-more',
	templateUrl: './club-eleven-learn-more.component.html',
	styleUrls: ['./club-eleven-learn-more.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class ClubElevenLearnMoreComponent implements OnInit {
	subHeaderNavContent: SubHeaderNavigationInterface;
	faq: Array<FaqInterface>;

	constructor() {
		/**
		 * Setup the header text
		 */
		this.subHeaderNavContent = {
			textColor: '#4c3017',
			iconColor: '#EE5A00'
		};

		/**
		 * This will likely come from a server or Wordpress. HTML is placed in this file only for demo purposes
		 */
		this.faq = [
			{
				'question': 'What is Club 11-11?',
				'answer': `<h6><strong>It is Pizza Pizza’s exclusive loyalty program!</strong></h6>
				<p>Earn 5% in Loyalty ‘Dollars’ on every order.</p>
				<p>Order only 5 times and redeem your Loyalty ‘Dollars’ after every 5th visit*</p>
				<p>Order another 5 times in order to unlock your next 5% collected, and so on and so forth.</p>
				<p>*Loyalty ‘Dollars’ must be redeemed within 90 days after your 5th visit.</p>
				<h6><strong>Examples:</strong></h6>
				<p>EXAMPLE 1</p>
				<p>Let’s say you visit any participating, traditional Pizza Pizza location 5 times and each order is $5.00.</p>
				<p>Earned Loyalty ‘Dollars’: You earn 5% (=$0.25) per order x 5 orders = $1.25.</p>
				<p>After 5 purchases of $5.00, as in this example, you have accumulated $1.25 in Loyalty ‘Dollars’,
				which you can redeem on your 6th visit!</p>
				<p>EXAMPLE 2</p>
				<p>Let’s look at another example where the purchase amounts are not always the same.
				 Let’s say you walk into a participating Pizza Pizza 5 times, as follows, and your orders are:</p>
				<table>
				<thead>
				<tr>
				<th>Order #</th>
				<th>Purchase Amount</th>
				<th>Loyalty ‘Dollars’</th>
				</tr>
				</thead>
				<tbody>
				<tr>
				<td>1</td>
				<td>$20.00</td>
				<td>$1.00</td>
				</tr>
				<tr>
				<td>2</td>
				<td>$15.00</td>
				<td>$0.75</td>
				</tr>
				<tr>
				<td>3</td>
				<td>$5.00</td>
				<td>$0.25</td>
				</tr>
				</tbody>
				<tfoot>
				<tr>
				<th colspan="2">Total Loyalty ‘Dollars’</th>
				<th>$2.00</th>
				</tr>
				</tfoot>
				</table>
				`
			},
			{
				'question': 'How do I join Pizza Pizza’s Club 11-11?',
				'answer': 'something'
			},
			{
				'question': 'If I already have a Pizza Pizza Gift Card, can I register that?',
				'answer': ''
			},
			{
				'question': 'What are Pizza Pizza Loyalty ‘Dollars’?',
				'answer': ''
			},
			{
				'question': 'Where is this valid?',
				'answer': ''
			},
			{
				'question': 'How is the 5% calculated?',
				'answer': ''
			},
			{
				'question': 'Can I earn Loyalty ‘Dollars’ on delivery orders?',
				'answer': ''
			},
			{
				'question': 'How do I earn Loyalty ‘Dollars’?',
				'answer': ''
			},
			{
				'question': 'Can I redeem Loyalty ‘Dollars’ on any order?',
				'answer': ''
			},
			{
				'question': 'How to Redeem?',
				'answer': ''
			},
			{
				'question': 'Can I redeem Loyalty ‘Dollars’ immediately?',
				'answer': ''
			},
			{
				'question': 'Will I always earn 5%?',
				'answer': ''
			},
			{
				'question': 'Will my Loyalty ‘Dollars’ expire?',
				'answer': ''
			},
			{
				'question': 'What happens to my Loyalty ‘Dollars’ earned prior to August 31, 2015 when the program changes take effect?',
				'answer': ''
			},
			{
				'question': 'Will my account close when my Loyalty ‘Dollars’ expire?',
				'answer': ''
			},
			{
				'question': 'What will happen to my account when I perform a full balance transfer?',
				'answer': ''
			},
			{
				'question': 'How can I get more out of the Club 11-11 loyalty program?',
				'answer': ''
			},
			{
				'question': 'When did Club 11-11 begin?',
				'answer': ''
			},
			{
				'question': 'Who can I speak to if I have further questions?',
				'answer': ''
			}
		]

	}

	/**
	 * Component init
	 */
	ngOnInit() {
	};

}
