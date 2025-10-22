// graficos.js - Módulo de Gráficos e Visualizações
// Instituto Horizonte Global

class GraficosManager {
    constructor() {
        this.charts = new Map();
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        console.log('📊 Inicializando módulo de gráficos...');
        this.createAllCharts();
        this.initChartAnimations();
        this.initialized = true;
    }

    createAllCharts() {
        // Gráfico 1: Comparativo 2024/2025
        this.createComparativoChart();
        
        // Gráfico 2: Previsão Orçamentária 2025
        this.createPrevisao2025Chart();
        
        // Gráfico 3: Desempenho 2025 vs Previsão 2026
        this.createDesempenhoChart();
        
        // Gráfico 4: Evolução 2020-2026
        this.createEvolucaoChart();
        
        // Gráfico 5: Investimento Internacional 2026
        this.createInternacional2026Chart();
        
        // Gráficos Canvas Personalizados
        this.createCustomCanvasCharts();
    }

    createComparativoChart() {
        const ctx = document.getElementById('graficoComparativo');
        if (!ctx) return;

        this.charts.set('comparativo', new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Doações Corporativas', 'Doações Individuais', 'Editais Públicos', 'Parcerias Internacionais', 'Total'],
                datasets: [{
                    label: '2024',
                    data: [3.8, 1.35, 1.0, 2.05, 8.2],
                    backgroundColor: '#7a9e7e',
                    borderColor: '#2c5530',
                    borderWidth: 1
                }, {
                    label: '2025 (Previsão)',
                    data: [5.5, 2.0, 2.5, 2.5, 12.5],
                    backgroundColor: '#2c5530',
                    borderColor: '#1e3a23',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor em R$ milhões'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: R$ ${context.raw} milhões`;
                            }
                        }
                    }
                }
            }
        }));
    }

    createPrevisao2025Chart() {
        const ctx = document.getElementById('graficoPrevisao2025');
        if (!ctx) return;

        this.charts.set('previsao2025', new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Educação Infantil', 'Juventude Conectada', 'Agricultura Sustentável', 'Saúde Comunitária', 'Expansão África', 'Pesquisa & Inovação', 'Administração'],
                datasets: [{
                    data: [22.4, 17.6, 12.0, 14.4, 20.0, 8.0, 6.4],
                    backgroundColor: [
                        '#2c5530', '#7a9e7e', '#e8b054', '#d19c3a', '#27ae60', '#3498db', '#9b59b6'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}% (R$ ${(context.raw * 12500 / 100).toLocaleString()})`;
                            }
                        }
                    }
                }
            }
        }));
    }

    createDesempenhoChart() {
        const ctx = document.getElementById('graficoDesempenho2025');
        if (!ctx) return;

        this.charts.set('desempenho', new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Receitas Totais (R$ M)', 'Pessoas Impactadas (K)', 'Países de Atuação', 'Projetos Ativos', 'Parcerias Internacionais'],
                datasets: [{
                    label: '2025 (Previsão)',
                    data: [12.5, 25, 8, 15, 12],
                    backgroundColor: '#2c5530'
                }, {
                    label: '2026 (Projeção)',
                    data: [18, 50, 12, 22, 18],
                    backgroundColor: '#e8b054'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label;
                                const value = context.raw;
                                const labels = context.chart.data.labels[context.dataIndex];
                                
                                if (labels.includes('R$ M')) {
                                    return `${label}: R$ ${value} milhões`;
                                } else if (labels.includes('K')) {
                                    return `${label}: ${value} mil pessoas`;
                                }
                                return `${label}: ${value}`;
                            }
                        }
                    }
                }
            }
        }));
    }

    createEvolucaoChart() {
        const ctx = document.getElementById('graficoEvolucao');
        if (!ctx) return;

        this.charts.set('evolucao', new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024', '2025*', '2026*'],
                datasets: [{
                    label: 'Arrecadação (R$ milhões)',
                    data: [3.2, 4.8, 5.6, 6.6, 8.2, 12.5, 18],
                    backgroundColor: 'rgba(44, 85, 48, 0.1)',
                    borderColor: '#2c5530',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#2c5530',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor em R$ milhões'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                if (context.dataIndex >= 5) {
                                    return '* Previsão';
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        }));
    }

    createInternacional2026Chart() {
        const ctx = document.getElementById('graficoInternacional2026');
        if (!ctx) return;

        this.charts.set('internacional2026', new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Hub Tecnológico África', 'Sede Europa', 'Sede Comunitárias Ásia', 'Instituto Pesquisa', 'Operações Latino América'],
                datasets: [{
                    data: [35, 20, 42, 50, 30],
                    backgroundColor: [
                        '#2c5530', '#7a9e7e', '#e8b054', '#d19c3a', '#27ae60'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: US$ ${(context.raw/10).toFixed(1)}M`;
                            }
                        }
                    }
                }
            }
        }));
    }

    createCustomCanvasCharts() {
        this.createDistribuicaoRecursos();
        this.createEvolucaoVoluntarios();
        this.createImpactoRegiao();
    }

    createDistribuicaoRecursos() {
        const canvas = document.getElementById('distribuicaoRecursos');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const recursosData = [35, 25, 20, 15, 5];
        const recursosLabels = ['Projetos Sociais', 'Infraestrutura', 'Pesquisa', 'Administração', 'Reserva'];
        const recursosColors = ['#2c5530', '#7a9e7e', '#e8b054', '#d19c3a', '#27ae60'];
        
        let startAngle = 0;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar gráfico de pizza
        recursosData.forEach((value, index) => {
            const sliceAngle = (value / 100) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            
            ctx.fillStyle = recursosColors[index];
            ctx.fill();

            // Adicionar legenda
            const legendX = 20;
            const legendY = 20 + index * 25;
            ctx.fillStyle = recursosColors[index];
            ctx.fillRect(legendX, legendY, 15, 15);
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText(`${recursosLabels[index]} (${value}%)`, legendX + 20, legendY + 12);
            
            startAngle += sliceAngle;
        });
    }

    createEvolucaoVoluntarios() {
        const canvas = document.getElementById('evolucaoVoluntarios');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const voluntariosData = [120, 180, 250, 320, 450, 600, 850];
        const voluntariosYears = ['2019', '2020', '2021', '2022', '2023', '2024', '2025*'];
        const maxVoluntarios = Math.max(...voluntariosData);
        
        const padding = 40;
        const graphWidth = canvas.width - padding * 2;
        const graphHeight = canvas.height - padding * 2;

        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar eixos
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Desenhar linha de dados
        ctx.strokeStyle = '#2c5530';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        voluntariosData.forEach((value, index) => {
            const x = padding + (index / (voluntariosData.length - 1)) * graphWidth;
            const y = canvas.height - padding - (value / maxVoluntarios) * graphHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Desenhar ponto
            ctx.fillStyle = '#2c5530';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Adicionar rótulo do ano
            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(voluntariosYears[index], x, canvas.height - padding + 15);
            
            // Adicionar valor
            ctx.fillStyle = '#2c5530';
            ctx.fillText(value.toString(), x, y - 10);
        });
        
        ctx.stroke();
        
        // Título do gráfico
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Evolução do Número de Voluntários', canvas.width / 2, 20);
    }

    createImpactoRegiao() {
        const canvas = document.getElementById('impactoRegiao');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const regioesData = [35, 25, 20, 15, 5];
        const regioesLabels = ['Nordeste', 'Sudeste', 'Norte', 'Sul', 'Centro-Oeste'];
        const regioesColors = ['#2c5530', '#7a9e7e', '#e8b054', '#d19c3a', '#27ae60'];
        
        const barWidth = 30;
        const barSpacing = 20;
        const maxBarHeight = canvas.height - 80;
        const startX = 60;

        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenhar barras
        regioesData.forEach((value, index) => {
            const barHeight = (value / 100) * maxBarHeight;
            const x = startX + index * (barWidth + barSpacing);
            const y = canvas.height - 40 - barHeight;
            
            // Desenhar barra
            ctx.fillStyle = regioesColors[index];
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Adicionar valor
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${value}%`, x + barWidth / 2, y - 10);
            
            // Adicionar rótulo
            ctx.fillText(regioesLabels[index], x + barWidth / 2, canvas.height - 20);
        });
        
        // Título do gráfico
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Impacto por Região do Brasil', canvas.width / 2, 20);
    }

    initChartAnimations() {
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateChartEntry(entry.target);
                }
            });
        }, { threshold: 0.3 });

        // Observar containers de gráficos
        document.querySelectorAll('.grafico-card').forEach(card => {
            chartObserver.observe(card);
        });
    }

    animateChartEntry(chartContainer) {
        chartContainer.style.opacity = '0';
        chartContainer.style.transform = 'translateY(30px)';
        chartContainer.style.transition = 'all 0.8s ease';

        setTimeout(() => {
            chartContainer.style.opacity = '1';
            chartContainer.style.transform = 'translateY(0)';
        }, 200);
    }

    // Métodos públicos para interação
    updateChartData(chartId, newData) {
        const chart = this.charts.get(chartId);
        if (chart) {
            chart.data.datasets[0].data = newData;
            chart.update();
        }
    }

    exportChartAsImage(chartId) {
        const chart = this.charts.get(chartId);
        if (chart) {
            const image = chart.toBase64Image();
            const link = document.createElement('a');
            link.download = `grafico-${chartId}-${new Date().toISOString().split('T')[0]}.png`;
            link.href = image;
            link.click();
        }
    }

    destroy() {
        this.charts.forEach(chart => {
            chart.destroy();
        });
        this.charts.clear();
        this.initialized = false;
    }
}

// Instância global
const Graficos = new GraficosManager();

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Graficos };
}