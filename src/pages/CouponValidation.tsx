
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Check, Loader2, QrCode, RefreshCw, X } from "lucide-react";
import { QrCodeScanner } from "@/components/scan/QrCodeScanner";
import { mockDataService } from "@/lib/mockData";
import { Coupon, Store, RedeemCouponResponse } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CouponValidation = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [storeToken, setStoreToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [store, setStore] = useState<Store | null>(null);

  const handleScan = (code: string) => {
    setCouponCode(code);
    setShowScanner(false);
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Por favor, informe o código do cupom");
      return;
    }

    if (!storeToken.trim()) {
      setError("Por favor, informe o token da loja");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setCoupon(null);
    setStore(null);

    try {
      // Validate store
      const storeResult = await mockDataService.validateStoreToken(storeToken);
      if (!storeResult) {
        setError("Token de loja inválido");
        setIsLoading(false);
        return;
      }
      setStore(storeResult);

      // Check coupon
      const couponResult = await mockDataService.getCouponByCode(couponCode);
      if (!couponResult) {
        setError("Cupom não encontrado");
        setIsLoading(false);
        return;
      }

      if (couponResult.isUsed) {
        setError("Este cupom já foi utilizado");
        setCoupon(couponResult);
        setIsLoading(false);
        return;
      }

      if (couponResult.expiresAt < new Date()) {
        setError("Este cupom está expirado");
        setCoupon(couponResult);
        setIsLoading(false);
        return;
      }

      setCoupon(couponResult);
    } catch (err) {
      setError("Erro ao validar cupom");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const redeemCoupon = async () => {
    if (!coupon || !store) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await mockDataService.redeemCoupon(couponCode, store.id);
      if (result.success) {
        setSuccess(result.message);
        if (result.coupon) {
          setCoupon(result.coupon);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Erro ao resgatar cupom");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCouponCode("");
    setStoreToken("");
    setCoupon(null);
    setStore(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Validação de Cupons</h1>
      
      {showScanner ? (
        <QrCodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      ) : (
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Verificar Cupom</CardTitle>
              <CardDescription>
                Digite o código do cupom ou escaneie o QR code para validar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="couponCode">Código do Cupom</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="couponCode"
                      placeholder="Digite o código do cupom"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button 
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={() => setShowScanner(true)}
                      disabled={isLoading}
                    >
                      <QrCode className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeToken">Token da Loja</Label>
                  <Input
                    id="storeToken"
                    placeholder="Digite o token da loja"
                    value={storeToken}
                    onChange={(e) => setStoreToken(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button 
                  className="w-full bg-brouwer-primary hover:bg-brouwer-secondary"
                  onClick={validateCoupon}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Check className="h-5 w-5 mr-2" />
                  )}
                  Validar Cupom
                </Button>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <X className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 bg-green-50 border-green-500 text-green-800">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Sucesso</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Detalhes do Cupom</CardTitle>
              <CardDescription>
                Informações do cupom e opção para resgate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {coupon ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Código</h3>
                        <p className="text-lg font-bold">{coupon.code}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Tipo de Cupom</h3>
                        <p className="text-lg font-semibold">{coupon.type === 'FIRST_PURCHASE' ? 'Primeira Compra' : 
                          coupon.type === 'BIRTHDAY' ? 'Aniversário' : 
                          coupon.type === 'LOYALTY' ? 'Fidelidade' : 
                          coupon.type === 'SPECIAL_PROMOTION' ? 'Promoção Especial' : 'Indicação'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Desconto</h3>
                        <p className="text-lg font-semibold text-brouwer-primary">{coupon.discount}%</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Validade</h3>
                        <p className="text-lg font-semibold">{coupon.expiresAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                      <p className="text-base">{coupon.description}</p>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <div className="flex items-center mt-1">
                        {coupon.isUsed ? (
                          <div className="flex items-center text-red-500">
                            <X className="h-5 w-5 mr-1" />
                            <span>Cupom já utilizado {coupon.usedAt && `em ${coupon.usedAt.toLocaleDateString()}`}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-green-500">
                            <Check className="h-5 w-5 mr-1" />
                            <span>Cupom válido para uso</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {store && !coupon.isUsed && (
                    <div className="bg-brouwer-light bg-opacity-30 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Loja: {store.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Token: {store.token} | Localização: {store.location}
                      </p>
                      <Button 
                        className="w-full bg-brouwer-primary hover:bg-brouwer-secondary"
                        onClick={redeemCoupon}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        ) : (
                          <Check className="h-5 w-5 mr-2" />
                        )}
                        Resgatar Cupom
                      </Button>
                    </div>
                  )}

                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <QrCode className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">Nenhum cupom verificado</h3>
                  <p className="text-gray-500 max-w-xs">
                    Digite um código de cupom ou escaneie um QR code para visualizar os detalhes do cupom.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CouponValidation;
