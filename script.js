document.addEventListener('DOMContentLoaded', () => {
    // --- Data Processing (Same as before) ---
    const breedsData = {
        'Locales': surveyData.reduce((acc, curr) => acc + (curr.races_locales || 0), 0),
        'Mixtes': surveyData.reduce((acc, curr) => acc + (curr.races_mixtes || 0), 0),
        'Etrangeres': surveyData.reduce((acc, curr) => acc + (curr.races_etrangeres || 0), 0)
    };

    const productionData = {
        'Viande': surveyData.reduce((acc, curr) => acc + (curr.production_viande || 0), 0),
        'Lait': surveyData.reduce((acc, curr) => acc + (curr.production_lait || 0), 0),
        'Mixte': surveyData.reduce((acc, curr) => acc + (curr.production_mixte || 0), 0)
    };

    const diseaseData = {
        'Mammites': surveyData.reduce((acc, curr) => acc + (curr.mammites || 0), 0),
        'Brucellose': surveyData.reduce((acc, curr) => acc + (curr.brucellose || 0), 0),
        'Danger Lait': surveyData.reduce((acc, curr) => acc + (curr.danger_lait || 0), 0)
    };

    const abortionFreqData = surveyData.reduce((acc, curr) => {
        acc[curr.avort_freq] = (acc[curr.avort_freq] || 0) + 1;
        return acc;
    }, {});

    const abortionStageData = {
        'Debut': surveyData.reduce((acc, curr) => acc + (curr.avort_stade_debut || 0), 0),
        'Milieu': surveyData.reduce((acc, curr) => acc + (curr.avort_stade_milieu || 0), 0),
        'Fin': surveyData.reduce((acc, curr) => acc + (curr.avort_stade_fin || 0), 0),
        'Variable': surveyData.reduce((acc, curr) => acc + (curr.avort_stade_variable || 0), 0)
    };

    const mortalityData = surveyData.reduce((acc, curr) => {
        acc[curr.mortalite] = (acc[curr.mortalite] || 0) + 1;
        return acc;
    }, {});

    // --- Chart Instances (Global to update later) ---
    let charts = {};

    // --- Translations ---
    const translations = {
        fr: {
            title: "Tableau de Bord de l'Enquête Vétérinaire",
            subtitle: "Analyse de la santé et de la production du bétail à Blida",
            titles: {
                breeds: "Distribution des Races",
                production: "Types de Production",
                disease: "Prévalence des Maladies",
                abortionFreq: "Fréquence des Avortements",
                abortionStage: "Stades d'Avortement",
                mortality: "Taux de Mortalité",
                discussion: "Discussion"
            },
            labels: {
                breeds: ['Locales', 'Mixtes', 'Étrangères'],
                production: ['Viande', 'Lait', 'Mixte'],
                disease: ['Mammites', 'Brucellose', 'Danger Lait'],
                abortionFreq: (k) => `Niveau ${k}`,
                abortionStage: ['Début', 'Milieu', 'Fin', 'Variable'],
                mortality: (k) => `Niveau ${k}`,
                occurrences: 'Occurrences',
                count: 'Nombre'
            },
            comments: {
                title: "Commentaire",
                breeds: "Le cheptel est quasi exclusivement constitué de races mixtes (95%), avec une quasi-absence de races pures locales ou étrangères, indiquant une stratégie de croisement généralisée.",
                production: "Le système d'élevage prédominant est mixte (lait et viande - 85%), confirmant la polyvalence recherchée par les éleveurs de la région.",
                disease: "Les mammites sont omniprésentes (touchant 95% des élevages), représentant le problème sanitaire majeur. La brucellose est présente dans 20% des cas, ce qui est significatif.",
                abortionFreq: "Les avortements sont fréquents, la majorité des vétérinaires signalant une fréquence moyenne (Niveau 2) à élevée, soulignant un problème de reproduction persistant.",
                abortionStage: "Les avortements surviennent à des stades variables pour la majorité des cas (60%), ce qui complique le diagnostic étiologique précis sans analyses approfondies.",
                mortality: "Bien que près de 50% des cas signalent une mortalité faible, l'autre moitié rapporte des taux moyens à élevés, indiquant des marges de progrès importantes dans la conduite sanitaire."
            },
            discussion: `
                <h3>Introduction</h3>
                <p>Les travaux sur l'analyse épidémiologique des élevages bovins dans la wilaya de Blida sont parcellaires. Il s'agit ici d'une description de quelques paramètres zootechniques et sanitaires chez le cheptel bovin de cette région. L'analyse de ces paramètres est un outil de diagnostic essentiel pour orienter les politiques de santé animale.</p>
                
                <p>Pour cela, une étude prospective a été réalisée. Plusieurs contraintes de terrain ont été observées telles que :</p>
                <blockquote>
                    <ul>
                        <li>Les difficultés d'accès à certaines exploitations en zones rurales.</li>
                        <li>La disponibilité variable des éleveurs pour répondre aux questionnaires détaillés.</li>
                        <li>La fiabilité des données déclaratives concernant l'historique sanitaire du troupeau.</li>
                    </ul>
                </blockquote>

                <p>Les résultats de la présente étude seront discutés par partie selon les caractéristiques raciales et l'état sanitaire :</p>

                <h3>2.1 - Caractéristiques de l'Élevage</h3>
                <h4>2.1.1 Choix Génétique et Races</h4>
                <p>Nous avons observé une nette prédominance des races mixtes (95% des cas) au détriment des races locales ou étrangères pures. Ce résultat diffère de certaines régions steppiques où la race locale prédomine, mais rejoint les tendances des zones périurbaines où la productivité (lait/viande) est recherchée à travers le croisement.</p>
                
                <h4>2.1.2 Orientation de Production</h4>
                <p>La production mixte (Lait & Viande) domine largement. Cela constitue une stratégie de résilience économique pour l'éleveur : en cas de baisse du prix du lait ou de problèmes sanitaires (mammites), la vente de veaux pour la viande assure un revenu complémentaire.</p>

                <h3>2.2 - Situation Sanitaire</h3>
                <h4>2.2.1 Pathologie Dominante : Les Mammites</h4>
                <p>Les résultats de cette étude montrent que les mammites sont le problème pathologique numéro un (95% de prévalence). Une prévalence aussi élevée suggère des défaillances dans l'hygiène de la traite, l'entretien de la litière ou le fonctionnement des machines à traire. C'est un point critique pour la rentabilité.</p>

                <h4>2.2.2 Reproduction et Avortements</h4>
                <p>Les troubles de la reproduction sont majeurs. La fréquence des avortements est jugée moyenne à élevée par 100% des vétérinaires interrogés. La variabilité des stades d'avortement complique le diagnostic, mais la présence confirmée de Brucellose (20%) est un signal d'alarme sanitaire qui nécessite un plan de lutte rigoureux.</p>
            `
        },
        ar: {
            title: "لوحة القيادة الخاصة بالتحقيق البيطري",
            subtitle: "تحليل صحة وإنتاج الماشية في ولاية البليدة",
            titles: {
                breeds: "توزيع السلالات",
                production: "أنواع الإنتاج",
                disease: "انتشار الأمراض",
                abortionFreq: "تواتر الإجهاض",
                abortionStage: "مراحل الإجهاض",
                mortality: "معدل الوفيات",
                discussion: "المناقشة"
            },
            labels: {
                breeds: ['محلي', 'مختلط', 'أجنبي'],
                production: ['لحم', 'حليب', 'مختلط'],
                disease: ['التهاب الضرع', 'الحمى المالطية', 'خطر الحليب'],
                abortionFreq: (k) => `المستوى ${k}`,
                abortionStage: ['بداية', 'وسط', 'نهاية', 'متغير'],
                mortality: (k) => `المستوى ${k}`,
                occurrences: 'تكرار',
                count: 'العدد'
            },
            comments: {
                title: "تحليل",
                breeds: "يتكون القطيع بشكل شبه حصري من سلالات مختلطة (95٪)، مع غياب شبه كامل للسلالات المحلية أو الأجنبية الصافية، مما يشير إلى استراتيجية تهجين واسعة النطاق.",
                production: "نظام التربية السائد هو النظام المختلط (حليب ولحم - 85٪)، مما يؤكد تعدد الأغراض الذي يبحث عنه المربون في المنطقة.",
                disease: "التهاب الضرع (Les mammites) موجود في كل مكان تقريبًا (يصيب 95٪ من المزارع)، ويمثل المشكلة الصحية الرئيسية. الحمى المالطية (Brucellose) موجودة في 20٪ من الحالات، وهي نسبة معتبرة.",
                abortionFreq: "حالات الإجهاض متكررة، حيث أبلغ غالبية الأطباء البيطريين عن تواتر متوسط (المستوى 2) إلى مرتفع، مما يسلط الضوء على مشكلة تناسلية مستمرة.",
                abortionStage: "تحدث عمليات الإجهاض في مراحل متغيرة بالنسبة لغالبية الحالات (60٪)، مما يعقد التشخيص الدقيق للسبب دون تحليلات مخبرية معمقة.",
                mortality: "على الرغم من أن ما يقرب من 50٪ من الحالات تشير إلى معدل وفيات منخفض، إلا أن النصف الآخر يبلغ عن معدلات متوسطة إلى مرتفعة، مما يشير إلى وجود هامش كبير للتحسن في الإدارة الصحية."
            },
            discussion: `
                <h3>مقدمة</h3>
                <p>تعتبر الدراسات حول التحليل الوبائي لمزارع الماشية في ولاية البليدة نادرة. يتعلق الأمر هنا بوصف لبعض المعايير الزوتقنية والصحية لدى قطيع الأبقار في هذه المنطقة. تحليل هذه المعايير هو أداة تشخيص أساسية لتوجيه سياسات الصحة الحيوانية.</p>

                <p>لهذا الغرض، تم إجراء دراسة استقصائية. وقد لوحظت عدة صعوبات ميدانية مثل:</p>
                <blockquote>
                    <ul>
                        <li>صعوبة الوصول إلى بعض المزارع في المناطق الريفية.</li>
                        <li>تفاوت مدى توفر المربين للإجابة على الاستبيانات المفصلة.</li>
                        <li>موثوقية البيانات المصرح بها بخصوص التاريخ الصحي للقطيع.</li>
                    </ul>
                </blockquote>

                <p>وستتم مناقشة نتائج الدراسة الحالية حسب الأجزاء وفقًا لخصائص السلالة والحالة الصحية:</p>

                <h3>2.1 - خصائص التربية</h3>
                <h4>2.1.1 الاختيار الجيني والسلالات</h4>
                <p>لاحظنا هيمنة واضحة للسلالات المختلطة (95٪ من الحالات) على حساب السلالات المحلية أو الأجنبية الصافية. تختلف هذه النتيجة عن بعض المناطق السهبية حيث تسود السلالة المحلية، لكنها تتفق مع اتجاهات المناطق شبه الحضرية حيث يُبحث عن الإنتاجية (حليب/لحم) من خلال التهجين.</p>

                <h4>2.1.2 اتجاه الإنتاج</h4>
                <p>الإنتاج المختلط (حليب ولحم) هو المسيطر بشكل كبير. يشكل هذا استراتيجية مرونة اقتصادية للمربي: في حالة انخفاض سعر الحليب أو مشاكل صحية (التهاب الضرع)، يضمن بيع العجول من أجل اللحم دخلاً إضافيًا.</p>

                <h3>2.2 - الحالة الصحية</h3>
                <h4>2.2.1 المرض السائد: التهاب الضرع</h4>
                <p>تظهر نتائج هذه الدراسة أن التهاب الضرع هو المشكلة المرضية رقم واحد (95٪ معدل انتشار). يشير هذا الانتشار المرتفع إلى وجود خلل في نظافة الحلب، صيانة الفرشة، أو تشغيل آلات الحلب. إنها نقطة حرجة للمردودية الاقتصادية.</p>

                <h4>2.2.2 التكاثر والإجهاض</h4>
                <p>مشاكل التكاثر رئيسية. يُعتبر تواتر الإجهاض متوسطًا إلى مرتفعًا من قبل 100٪ من الأطباء البيطريين الذين تمت مقابلتهم. يعقد تباين مراحل الإجهاض التشخيص، لكن الوجود المؤكد للحمى المالطية (20٪) هو إنذار صحي يتطلب خطة مكافحة صارمة.</p>
            `
        }
    };

    // --- Switch Language Function ---
    window.setLanguage = (lang) => {
        const t = translations[lang];
        const isRTL = lang === 'ar';
        document.body.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // Update Text Content
        document.getElementById('page-title').innerText = t.title;
        document.getElementById('page-subtitle').innerText = t.subtitle;
        document.getElementById('discussion-title').innerText = t.titles.discussion;

        // Update Comment Titles
        document.querySelectorAll('.comment-title').forEach(el => el.innerText = t.comments.title);

        // Update Chart Titles & Comments
        const chartIds = ['breeds', 'production', 'disease', 'abortionFreq', 'abortionStage', 'mortality'];
        const chartKeys = ['breeds', 'production', 'disease', 'abortionFreq', 'abortionStage', 'mortality']; // mapping keys

        chartIds.forEach((id, index) => {
            const key = chartKeys[index];
            document.getElementById(`title-${id === 'abortionFreq' ? 'abortion-freq' : id === 'abortionStage' ? 'abortion-stage' : id}`).innerText = t.titles[key];
            document.getElementById(`comment-${id === 'abortionFreq' ? 'abortion-freq' : id === 'abortionStage' ? 'abortion-stage' : id}`).innerText = t.comments[key];
        });

        // Update Discussion Content
        document.getElementById('discussion-content').innerHTML = t.discussion;

        // Update Buttons
        document.querySelectorAll('.lang-switch button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.lang-switch button[onclick="setLanguage('${lang}')"]`).classList.add('active');

        // Re-render charts with new labels
        renderCharts(lang);
    };

    function renderCharts(lang) {
        const t = translations[lang];
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        };

        // Helper to destroy old charts
        Object.values(charts).forEach(chart => chart.destroy());

        // 1. Breeds
        charts.breeds = new Chart(document.getElementById('breedsChart'), {
            type: 'doughnut',
            data: {
                labels: t.labels.breeds,
                datasets: [{
                    data: Object.values(breedsData),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                }]
            },
            options: commonOptions
        });

        // 2. Production
        charts.production = new Chart(document.getElementById('productionChart'), {
            type: 'pie',
            data: {
                labels: t.labels.production,
                datasets: [{
                    data: Object.values(productionData),
                    backgroundColor: ['#4BC0C0', '#9966FF', '#FF9F40'],
                }]
            },
            options: commonOptions
        });

        // 3. Disease
        charts.disease = new Chart(document.getElementById('diseaseChart'), {
            type: 'bar',
            data: {
                labels: t.labels.disease,
                datasets: [{
                    label: t.labels.occurrences,
                    data: Object.values(diseaseData),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                }]
            },
            options: {
                ...commonOptions,
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });

        // 4. Abortion Freq
        charts.abortionFreq = new Chart(document.getElementById('abortionFreqChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(abortionFreqData).map(k => t.labels.abortionFreq(k)),
                datasets: [{
                    label: t.labels.count,
                    data: Object.values(abortionFreqData),
                    backgroundColor: '#9966FF'
                }]
            },
            options: {
                ...commonOptions,
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });

        // 5. Abortion Stage
        charts.abortionStage = new Chart(document.getElementById('abortionStageChart'), {
            type: 'polarArea',
            data: {
                labels: t.labels.abortionStage,
                datasets: [{
                    data: Object.values(abortionStageData),
                    backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED']
                }]
            },
            options: commonOptions
        });

        // 6. Mortality
        charts.mortality = new Chart(document.getElementById('mortalityChart'), {
            type: 'bar',
            data: {
                labels: Object.keys(mortalityData).map(k => t.labels.mortality(k)),
                datasets: [{
                    label: t.labels.count,
                    data: Object.values(mortalityData),
                    backgroundColor: '#FF9F40'
                }]
            },
            options: {
                ...commonOptions,
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }

    // Initialize with French (Default)
    setLanguage('fr');
});
