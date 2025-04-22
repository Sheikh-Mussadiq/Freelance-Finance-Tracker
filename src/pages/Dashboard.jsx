import { motion } from 'framer-motion'
import { useData } from '../context/DataContext'
import { format } from 'date-fns'
import { CardShimmer, TableShimmer } from '../components/ui/Shimmer'

// Icon components
const MoneyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const PendingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ExpenseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m-6-1.5H2.25m19.5 0h-6.75" />
  </svg>
)

const NetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
  </svg>
)

// Animation variants
const cardVariants = {
  initial: { y: 20, opacity: 0 },
  animate: (i) => ({ 
    y: 0, 
    opacity: 1, 
    transition: { 
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut"
    } 
  })
}

const Dashboard = () => {
  const { projects, expenses, accounts, getStats, loading } = useData()
  const stats = getStats()
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'PKR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  // Get recent projects (last 3)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 3)

  // Get recent expenses (last 5)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Overview of your freelance business finances
        </p>
      </header>

      {/* Stats section */}
      <section className="dashboard-stats grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Shimmer loading state for stats cards
          <>
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
            <CardShimmer />
          </>
        ) : (
          <>
            <motion.div 
              className="card bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={0}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-100">
                  <MoneyIcon />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earned</h2>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalEarned)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="card bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={1}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-100">
                  <PendingIcon />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payments</h2>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalPending)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="card bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={2}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-100">
                  <ExpenseIcon />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</h2>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalExpenses)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="card bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={3}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-100">
                  <NetIcon />
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Balance</h2>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.netBalance)}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </section>

      {/* Content section */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Active Projects */}
        <motion.div
          className="card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Projects</h2>
          
          {loading ? (
            // Shimmer loading state for projects table
            <TableShimmer rows={3} columns={4} widths={[30, 20, 20, 30]} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {project.client}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                            : project.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        }`}>
                          {project.status === 'in-progress' ? 'In Progress' : 
                           project.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium">
                        <span className={`${
                          project.totalAmount - project.paidAmount > 0
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {formatCurrency(project.totalAmount - project.paidAmount)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                      No projects found
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          className="card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Expenses</h2>
          
          {loading ? (
            // Shimmer loading state for expenses table
            <TableShimmer rows={5} columns={3} widths={[40, 30, 30]} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentExpenses.length > 0 ? (
                  recentExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {expense.name}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {expense.date ? format(new Date(expense.date), 'MMM d, yyyy') : 'Not set'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600 dark:text-red-400">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                      No expenses found
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </section>

      {/* Bank Accounts Summary */}
      <motion.section 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Bank Accounts</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {accounts.map((account, index) => (
            <motion.div 
              key={account.id}
              className={`p-4 rounded-lg border ${
                account.type === 'Credit'
                  ? 'border-red-100 dark:border-red-900'
                  : account.type === 'Savings'
                  ? 'border-green-100 dark:border-green-900'
                  : 'border-blue-100 dark:border-blue-900'
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + (index * 0.1) }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{account.name}</p>
                  <p className={`text-xl font-bold ${
                    account.type === 'Credit'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatCurrency(account.balance)}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  account.type === 'Credit'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    : account.type === 'Savings'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                }`}>
                  {account.type}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Updated: {account.lastUpdated ? format(new Date(account.lastUpdated), 'MMM d, yyyy') : 'Not set'}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default Dashboard