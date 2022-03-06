const tokenTypes = {
	ACCESS: 'access',
	REFRESH: 'refresh',
	RESET_PASSWORD: 'resetPassword',
	VERIFY_EMAIL: 'verifyEmail',
}

const ticketTypes = {
	PENDING: 'pending',
	APPROVED: 'approved',
	REJECTED: 'rejected',
	CANCELLED: 'cancelled'
}

const roleTypes = {
	USER: 'user',
	ADMIN: 'admin',
}

module.exports = {
	tokenTypes,
	ticketTypes,
	roleTypes,
}