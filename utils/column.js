const userColumn = [
  { header: 'Index', key: 'Index', width: 10 },
  { header: 'Name', key: 'name', width: 15 },
  { header: 'Email', key: 'email', width: 30 },
  // { header: 'Username', key: 'username', width: 12 },
  { header: 'Joined', key: 'createdAt', width: 15 },
];

const subscriptionColumn = [
  { header: 'Index', key: 'Index', width: 15 },

  { header: 'Email', key: 'user', width: 30 },
  { header: 'Course', key: 'course', width: 30 },
  { header: 'Purchased At', key: 'boughtAt', width: 20 },
  { header: 'Expires At', key: 'expiresAt', width: 20 },
  { header: 'Paid', key: 'paid', width: 10 },
  { header: 'Active', key: 'active', width: 10 },
];

module.exports = {
  userColumn,
  subscriptionColumn,
};
