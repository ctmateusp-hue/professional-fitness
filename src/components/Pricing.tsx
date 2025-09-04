import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, Crown, Barbell, MusicNote, Calendar, Timer, Star } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

const WHATSAPP_LINK = "https://wa.me/5517988275111?text=Quero%20saber%20mais%20sobre%20os%20planos%20da%20academia";

export function Pricing() {
  const plans = [
    {
      name: "Musculação",
      price: "70",
      description: "Acesso completo à musculação",
      features: [
        "Acesso à área de musculação",
        "Treino personalizado",
        "Acompanhamento profissional",
        "Horário livre"
      ],
      icon: Barbell,
      color: "bg-blue-500",
      special: false
    },
    {
      name: "Plano Black",
      price: "130",
      fidelityPrice: "120",
      description: "Acesso completo a todas as modalidades",
      features: [
        "Todas as modalidades",
        "Musculação + Funcional + Zumba",
        "Treino personalizado",
        "Acompanhamento nutricional",
        "Horário livre",
        "Desconto na fidelidade"
      ],
      icon: Crown,
      color: "bg-gradient-to-r from-gray-800 to-black",
      special: true
    },
    {
      name: "Zumba",
      price: "100",
      description: "Aulas de dança e condicionamento",
      features: [
        "Aulas de Zumba",
        "Professora especializada",
        "Ambiente climatizado",
        "Horários específicos"
      ],
      icon: MusicNote,
      color: "bg-pink-500",
      special: false
    }
  ]

  const packagePlans = [
    {
      name: "Musculação Trimestral",
      price: "180",
      monthlyPrice: "60",
      period: "3 meses",
      savings: "R$ 30",
      icon: Timer,
      color: "bg-blue-600"
    },
    {
      name: "Plano Trimestral",
      price: "300",
      monthlyPrice: "100",
      period: "3 meses",
      savings: "R$ 90",
      icon: Calendar,
      color: "bg-green-600"
    },
    {
      name: "Plano Semestral",
      price: "520",
      monthlyPrice: "87",
      period: "6 meses",
      savings: "R$ 260",
      icon: Calendar,
      color: "bg-purple-600"
    },
    {
      name: "Plano Anual",
      price: "980",
      monthlyPrice: "82",
      period: "12 meses",
      savings: "R$ 580",
      icon: Star,
      color: "bg-gradient-to-r from-purple-600 to-blue-600",
      popular: true
    }
  ]

  return (
    <section id="precos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-4 text-foreground">
            Planos e Preços
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Escolha o plano ideal para você. Temos opções para todos os perfis e objetivos. 
            <span className="text-accent font-semibold"> Desconto especial para fidelidade!</span>
          </p>
        </motion.div>

        {/* Planos Mensais */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">Planos Mensais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.special && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </span>
                  </div>
                )}
                
                <Card className={`relative overflow-hidden border-2 ${plan.special ? 'border-accent shadow-xl scale-105 bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'border-border bg-card'} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-8">
                  <div className={`text-center mb-6 ${plan.special ? 'relative' : ''}`}>
                    <div className={`w-16 h-16 ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4 ${plan.special ? 'ring-4 ring-accent/20' : ''}`}>
                      <plan.icon size={32} className="text-white" weight="bold" />
                    </div>
                    <h4 className={`text-2xl font-bold mb-2 ${plan.special ? 'text-white' : 'text-foreground'}`}>
                      {plan.name}
                    </h4>
                    <p className={`${plan.special ? 'text-gray-300' : 'text-muted-foreground'}`}>{plan.description}</p>
                  </div>

                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className={`text-4xl font-black ${plan.special ? 'text-white' : 'text-foreground'}`}>R$ {plan.price}</span>
                        <span className={`${plan.special ? 'text-gray-300' : 'text-muted-foreground'}`}>/mês</span>
                      </div>
                      {plan.fidelityPrice && (
                        <div className="mt-2">
                          <span className={`font-semibold ${plan.special ? 'text-yellow-400' : 'text-accent'}`}>
                            Fidelidade: R$ {plan.fidelityPrice}/mês
                          </span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <Check size={20} className={`${plan.special ? 'text-yellow-400' : 'text-accent'} flex-shrink-0`} weight="bold" />
                          <span className={`${plan.special ? 'text-gray-200' : 'text-muted-foreground'}`}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                      size="lg"
                      asChild
                    >
                      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                        Escolher Plano
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Planos de Fidelidade */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            Planos de Fidelidade 
            <span className="text-accent ml-2">💰 Economize Mais!</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packagePlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      MELHOR OFERTA
                    </span>
                  </div>
                )}
                
                <Card className={`relative overflow-hidden border-2 ${plan.popular ? 'border-purple-500 shadow-xl' : 'border-border'} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className={`w-12 h-12 ${plan.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <plan.icon size={24} className="text-white" weight="bold" />
                      </div>
                      <h4 className="text-lg font-bold mb-1 text-foreground">{plan.name}</h4>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>

                    <div className="text-center mb-4">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-black text-foreground">R$ {plan.price}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        ou R$ {plan.monthlyPrice}/mês
                      </div>
                      <div className="text-accent font-semibold text-sm mt-1">
                        Economia: {plan.savings}
                      </div>
                    </div>

                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'} text-white font-semibold`}
                      size="sm"
                      asChild
                    >
                      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                        Contratar
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-primary rounded-2xl p-8 text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">
              Não encontrou o plano ideal?
            </h3>
            <p className="mb-6 text-primary-foreground/90">
              Entre em contato conosco e vamos criar um plano personalizado para você!
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              asChild
            >
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                Falar com Especialista
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
