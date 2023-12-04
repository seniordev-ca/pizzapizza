// Server model
import { Club11BalanceResponse, ClubTransactionsResponse } from '../../models/server-models/server-club11';

// View model
import { Club11BalanceInterface, TransactionHistoryRowInterface } from '../../models/club11';


export class Club11Mapper {

	/**
	 * Maps server model to client model
	 */
	static parseClub11Balance(
		balanceResponse: Club11BalanceResponse
	): Club11BalanceInterface {

		return {
			available: balanceResponse.available,
			balanceToken: balanceResponse.card_balance_token,
			maskedCardNumber: balanceResponse.card_number,
			earned: balanceResponse.earned,
			loyaltyPercentage: balanceResponse.loyalty_percentage,
			requireText: balanceResponse.require_text,
			earnedText: balanceResponse.club_11_11_earnings,
			balanceReadyText: balanceResponse.checkout_earnings.message,
			earningsBanner: {
				showBanner: balanceResponse.earnings_banner.show_banner,
				message: balanceResponse.earnings_banner.message
			}
		}
	}

	/**
	 * Maps club 11 11 transaction history
	 */
	static parseClubTransactionsHistory(
		transactionResponse: ClubTransactionsResponse
	): TransactionHistoryRowInterface[] {

		return transactionResponse.transactions.map(serverData => {
			return {
				date: serverData.date,
				amount: serverData.amount,
				type: serverData.type,
				location: serverData.location,
				time: serverData.time,
				loyalty: serverData.loyalty
			} as TransactionHistoryRowInterface
		})
	}
}
