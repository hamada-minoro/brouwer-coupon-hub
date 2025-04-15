
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCard } from "@/components/dashboard/AnalyticsCard";
import { mockDataService } from "@/lib/mockData";
import { CouponTypeAnalytics, StoreAnalytics, TimeAnalytics } from "@/lib/types";
import { BarChart, BookOpen, Calendar, Package, Store } from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState<{
    couponTypes: CouponTypeAnalytics[];
    stores: StoreAnalytics[];
    timeline: TimeAnalytics[];
    totalRedeemed: number;
    totalActive: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await mockDataService.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const couponTypeColors = [
    "#9b87f5", // primary
    "#7E69AB", // secondary
    "#D6BCFA", // light
    "#ea384c", // red
    "#1EAEDB", // blue
  ];

  const formatCouponType = (type: string) => {
    switch (type) {
      case "FIRST_PURCHASE":
        return "Primeira Compra";
      case "BIRTHDAY":
        return "Aniversário";
      case "LOYALTY":
        return "Fidelidade";
      case "SPECIAL_PROMOTION":
        return "Promoção Especial";
      case "REFERRAL":
        return "Indicação";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brouwer-primary mx-auto mb-4"></div>
          <p className="text-brouwer-secondary">Carregando dados do dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard de Cupons</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-muted-foreground">Cupons Resgatados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-brouwer-primary mr-2" />
              <div className="text-3xl font-bold">{analytics?.totalRedeemed || 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-muted-foreground">Cupons Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-brouwer-primary mr-2" />
              <div className="text-3xl font-bold">{analytics?.totalActive || 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-muted-foreground">Lojas Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Store className="h-5 w-5 text-brouwer-primary mr-2" />
              <div className="text-3xl font-bold">{analytics?.stores.length || 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-muted-foreground">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-brouwer-primary mr-2" />
              <div className="text-3xl font-bold">
                {analytics ? Math.round((analytics.totalRedeemed / (analytics.totalRedeemed + analytics.totalActive)) * 100) : 0}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsCard title="Tipos de Cupons Utilizados" icon={<Package className="h-5 w-5" />}>
          {analytics && analytics.couponTypes.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.couponTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="type"
                    label={({ name, percent }) => 
                      `${formatCouponType(name as string)} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {analytics.couponTypes.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={couponTypeColors[index % couponTypeColors.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, formatCouponType(name as string)]} 
                  />
                  <Legend formatter={(value) => formatCouponType(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </AnalyticsCard>

        <AnalyticsCard title="Cupons Resgatados por Loja" icon={<Store className="h-5 w-5" />}>
          {analytics && analytics.stores.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={analytics.stores}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="storeName" 
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="couponsRedeemed" 
                    fill="#9b87f5" 
                    name="Cupons Resgatados" 
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </AnalyticsCard>
      </div>

      <div className="mb-8">
        <AnalyticsCard title="Resgate de Cupons nos Últimos 7 Dias" icon={<BarChart className="h-5 w-5" />}>
          {analytics && analytics.timeline.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={analytics.timeline}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="#7E69AB" 
                    name="Cupons Resgatados" 
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">Nenhum dado disponível</p>
            </div>
          )}
        </AnalyticsCard>
      </div>
    </div>
  );
};

export default Dashboard;
