
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Settings, AlertCircle, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { CouponRule, CouponType } from "@/lib/types";
import { mockDataService } from "@/lib/mockData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";

const Rules = () => {
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CouponType>("FIRST_PURCHASE");
  const [discount, setDiscount] = useState("10");
  const [triggerType, setTriggerType] = useState<"REGISTRATION" | "MANUAL" | "BIRTHDAY" | "PURCHASE_COUNT">("REGISTRATION");
  
  // App state
  const [rules, setRules] = useState<CouponRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch rules on load
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const rulesData = await mockDataService.getCouponRules();
        setRules(rulesData);
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  // Create new rule
  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    // Validation
    if (!name.trim()) {
      setError("Nome da regra é obrigatório");
      setSubmitting(false);
      return;
    }

    if (!description.trim()) {
      setError("Descrição da regra é obrigatória");
      setSubmitting(false);
      return;
    }

    const discountValue = parseInt(discount);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      setError("Desconto deve ser um valor entre 1 e 100");
      setSubmitting(false);
      return;
    }

    try {
      const result = await mockDataService.saveCouponRule({
        name,
        description,
        type,
        discount: discountValue,
        triggerType,
        isActive: true,
      });

      if (result.success) {
        setSuccess("Regra de cupom criada com sucesso!");
        setRules([...rules, result.rule]);
        
        // Reset form
        setName("");
        setDescription("");
        setType("FIRST_PURCHASE");
        setDiscount("10");
        setTriggerType("REGISTRATION");
      }
    } catch (error) {
      console.error("Error creating rule:", error);
      setError("Erro ao criar regra de cupom");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle rule status
  const toggleRuleStatus = async (ruleId: string) => {
    try {
      const result = await mockDataService.toggleRuleStatus(ruleId);
      if (result.success) {
        setRules(
          rules.map(rule => 
            rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
          )
        );
      }
    } catch (error) {
      console.error("Error toggling rule status:", error);
    }
  };

  // Helper to format coupon type
  const formatCouponType = (type: CouponType) => {
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
    }
  };

  // Helper to format trigger type
  const formatTriggerType = (trigger: string) => {
    switch (trigger) {
      case "REGISTRATION":
        return "Cadastro de Cliente";
      case "MANUAL":
        return "Emissão Manual";
      case "BIRTHDAY":
        return "Aniversário de Cliente";
      case "PURCHASE_COUNT":
        return "Quantidade de Compras";
      default:
        return trigger;
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Regras de Cupons</h1>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="current">Regras Atuais</TabsTrigger>
          <TabsTrigger value="create">Criar Nova Regra</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-brouwer-primary" />
            </div>
          ) : (
            <>
              {rules.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-brouwer-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Nenhuma regra encontrada</h3>
                  <p className="text-gray-500">
                    Crie novas regras para automatizar a emissão de cupons.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rules.map((rule) => (
                    <Card key={rule.id} className={rule.isActive ? "border-l-4 border-l-brouwer-primary" : "opacity-75"}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{rule.name}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {rule.isActive ? "Ativa" : "Inativa"}
                            </span>
                            <Switch 
                              checked={rule.isActive} 
                              onCheckedChange={() => toggleRuleStatus(rule.id)}
                            />
                          </div>
                        </div>
                        <CardDescription>{rule.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-500">Tipo de Cupom</p>
                            <p>{formatCouponType(rule.type)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Desconto</p>
                            <p className="text-brouwer-primary font-bold">{rule.discount}%</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Disparada por</p>
                            <p>{formatTriggerType(rule.triggerType)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-500">Criada em</p>
                            <p>{new Date(rule.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-brouwer-primary" />
                Nova Regra de Cupom
              </CardTitle>
              <CardDescription>
                Configure uma nova regra para emissão automática de cupons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRule}>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-6 bg-green-50 border-green-500 text-green-800">
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Sucesso</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Regra</Label>
                      <Input 
                        id="name" 
                        placeholder="Ex: Cupom de Boas-vindas" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount">Desconto (%)</Label>
                      <Input 
                        id="discount" 
                        type="number" 
                        min="1"
                        max="100"
                        placeholder="10" 
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descreva a regra do cupom" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de Cupom</Label>
                      <Select 
                        value={type} 
                        onValueChange={(value) => setType(value as CouponType)}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Selecione o tipo de cupom" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIRST_PURCHASE">Primeira Compra</SelectItem>
                          <SelectItem value="BIRTHDAY">Aniversário</SelectItem>
                          <SelectItem value="LOYALTY">Fidelidade</SelectItem>
                          <SelectItem value="SPECIAL_PROMOTION">Promoção Especial</SelectItem>
                          <SelectItem value="REFERRAL">Indicação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trigger">Disparado por</Label>
                      <Select 
                        value={triggerType} 
                        onValueChange={(value) => setTriggerType(value as any)}
                      >
                        <SelectTrigger id="trigger">
                          <SelectValue placeholder="Selecione o gatilho" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REGISTRATION">Cadastro de Cliente</SelectItem>
                          <SelectItem value="MANUAL">Emissão Manual</SelectItem>
                          <SelectItem value="BIRTHDAY">Aniversário de Cliente</SelectItem>
                          <SelectItem value="PURCHASE_COUNT">Quantidade de Compras</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      className="bg-brouwer-primary hover:bg-brouwer-secondary text-white"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5 mr-2" />
                          <span>Criar Regra de Cupom</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rules;
