;user1
(hybrird-exchange.buy-ht)
;user1
(hybrird-exchange.trans-to-priv)
;returns -> "user1-2019-10-3120:08:06.394067"
;this maybe shoudl already debit the user
;admin -> returns id of the transfer
(hybrird-exchange.check-status)
;admin
(hybrird-exchange.debit-ht)

;;goes to kuro

;if no account create it
;need the guard
(hybrid-token.create-account)
(hybrid-token.credit-ht)


;back to cw
(hybrid-exchange.confirm-transfer-to-kuro)
