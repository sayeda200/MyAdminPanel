import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Users, DollarSign, ShoppingCart, TrendingUp, BarChart3, Settings, Package, Download } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4'];

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    conversionRate: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/dashboard');
      const data = await response.json();

      setSalesData(data.salesData);
      setUserData(data.userData);
      setStats({
        ...data.stats,
        activeUsers: Math.floor(data.stats.totalUsers * 0.75)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSalesData([
        { month: 'Jan', sales: 4200 },
        { month: 'Feb', sales: 3800 },
        { month: 'Mar', sales: 5200 },
        { month: 'Apr', sales: 6780 },
        { month: 'May', sales: 7890 },
        { month: 'Jun', sales: 8390 },
        { month: 'Jul', sales: 9490 }
      ]);

      setUserData([
        { name: 'New Users', value: 450 },
        { name: 'Returning', value: 350 },
        { name: 'Inactive', value: 150 },
        { name: 'Premium', value: 200 }
      ]);

      setStats({
        totalUsers: 2150,
        totalRevenue: 45678,
        totalOrders: 524,
        conversionRate: 5.2,
        activeUsers: 1612
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadDashboardData = () => {
    const dashboardData = {
      generatedAt: new Date().toISOString(),
      statistics: stats,
      salesData: salesData,
      userData: userData,
      recentActivity: [
        {
          type: 'registration',
          description: 'New user registration - John Doe joined the platform',
          timestamp: '2 minutes ago'
        },
        {
          type: 'sale',
          description: 'New sale - Order #1234 completed',
          timestamp: '15 minutes ago'
        },
        {
          type: 'product',
          description: 'Product update - New product added to catalog',
          timestamp: '1 hour ago'
        }
      ]
    };

    const jsonString = JSON.stringify(dashboardData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    let csv = 'Dashboard Report\n\n';

    csv += 'Statistics\n';
    csv += 'Metric,Value\n';
    csv += `Total Users,${stats.totalUsers}\n`;
    csv += `Total Revenue,$${stats.totalRevenue}\n`;
    csv += `Total Orders,${stats.totalOrders}\n`;
    csv += `Conversion Rate,${stats.conversionRate}%\n`;
    csv += `Active Users,${stats.activeUsers}\n\n`;

    csv += 'Sales Data\n';
    csv += 'Month,Sales\n';
    salesData.forEach(item => {
      csv += `${item.month},${item.sales}\n`;
    });

    csv += '\nUser Distribution\n';
    csv += 'Category,Value\n';
    userData.forEach(item => {
      csv += `${item.name},${item.value}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="w-64 bg-muted/50 border-r min-h-screen p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Management Dashboard</p>
          </div>

          <nav className="space-y-1">
            <Button variant="default" className="w-full justify-start gap-3">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Users className="h-4 w-4" />
              Users
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <DollarSign className="h-4 w-4" />
              Sales
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Package className="h-4 w-4" />
              Products
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 bg-background/50">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">Welcome back, Admin! Here's what's happening today.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
                <Button variant="outline" onClick={downloadDashboardData}>
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
                <Button variant="outline" onClick={fetchDashboardData} disabled={loading}>
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Users</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800 dark:text-green-200">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Orders</CardTitle>
                <ShoppingCart className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-800 dark:text-amber-200">{stats.totalOrders.toLocaleString()}</div>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">+5% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Conversion Rate</CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-800 dark:text-orange-200">{stats.conversionRate}%</div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">+2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#0088FE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>User demographics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest user actions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">U</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-sm text-muted-foreground">John Doe joined the platform</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">2 minutes ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">$</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">New sale</p>
                      <p className="text-sm text-muted-foreground">Order #1234 completed</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">15 minutes ago</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">P</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Product update</p>
                      <p className="text-sm text-muted-foreground">New product added to catalog</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">1 hour ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
