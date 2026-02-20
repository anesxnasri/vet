document.addEventListener('DOMContentLoaded', () => {
    // --- Data Processing ---
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

    // --- Chart Instances ---
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
                discussion: "Discussion & Synthèse"
            },
            labels: {
                breeds: ['Locales', 'Mixtes', 'Étrangères'],
                production: ['Viande', 'Lait', 'Mixte'],
                disease: ['Mammites', 'Brucellose', 'Danger Lait'],
                abortionFreq: (k) => `Niveau ${k}`,
                abortionStage: ['Début', 'Milieu', 'Fin', 'Variable'],
                mortality: (k) => `Niveau ${k}`,
                occurrences: 'Cas Recensés', // Changed from 'Occurrences' to be clearly French
                count: 'Nombre'
            },
            comments: {
                title: "Commentaire",
                breeds: "Le cheptel est quasi exclusivement constitué de races mixtes (95%), avec une quasi-absence de races pures locales ou étrangères, indiquant une stratégie de croisement généralisée pour optimiser la résistance et la production.",
                production: "Le système d'élevage prédominant est mixte (lait et viande - 85%), confirmant la polyvalence recherchée par les éleveurs de la région pour sécuriser leurs revenus.",
                disease: "Les mammites sont omniprésentes (touchant 95% des élevages), représentant le problème sanitaire majeur. La brucellose est présente dans 20% des cas, ce qui est significatif et préoccupant.",
                abortionFreq: "Les avortements sont fréquents, la majorité des vétérinaires signalant une fréquence moyenne (Niveau 2) à élevée, soulignant un problème de reproduction persistant probablement lié aux pathologies identifiées.",
                abortionStage: "Les avortements surviennent à des stades variables pour la majorité des cas (60%), ce qui complique le diagnostic étiologique précis (infectieux vs alimentaire) sans analyses approfondies.",
                mortality: "Bien que près de 50% des cas signalent une mortalité faible, l'autre moitié rapporte des taux moyens à élevés (surtout Niveau 3 dans 20% des cas), indiquant des marges de progrès importantes dans la conduite sanitaire et la néonatologie."
            },
            discussion: `
                <h3>1. Introduction et Contexte de l'Étude</h3>
                <p>La présente investigation épidémiologique offre une cartographie actualisée des paramètres zootechniques et sanitaires des élevages bovins dans la wilaya de Blida. Bien que la région possède un potentiel agricole indéniable, le recueil des données s'est heurté à des défis inhérents à la médecine vétérinaire de terrain : l'enclavement de certaines exploitations, la réticence ou la disponibilité limitée des éleveurs, ainsi que les biais liés à l'anamnèse purement déclarative. Néanmoins, l'analyse croisée des résultats obtenus permet de dégager des tendances lourdes sur la gestion du cheptel régional, qui seront discutées sous trois axes majeurs.</p>

                <h3>2. Profil Zootechnique et Stratégie d'Élevage</h3>
                <p>L'analyse de la structure du cheptel révèle une orientation claire et pragmatique des éleveurs. On constate une écrasante majorité de races mixtes (95%), couplée à une vocation de production mixte (viande et lait - 85%). Ce constat n'est pas fortuit ; il traduit une véritable stratégie de résilience économique. Dans un contexte où le prix des intrants (alimentation) fluctue et où le marché du lait peut être instable, la polyvalence génétique permet à l'éleveur d'agir sur deux tableaux. Le veau de boucherie devient ainsi une assurance financière, agissant comme un amortisseur de chocs en cas de baisse de la production laitière ou de saisies sanitaires.</p>

                <h3>3. Bilan Sanitaire et Conduite d'Élevage</h3>
                <p>Le tableau clinique général met en évidence des lacunes importantes dans la conduite sanitaire quotidienne :</p>
                
                <p><strong>Péril Mammaire et Qualité du Lait :</strong> Les mammites règnent en maître absolu avec une omniprésence touchant 95% des élevages. Ce taux alarmant est un indicateur direct d'un déficit flagrant dans l'hygiène de la traite, la gestion de la litière ou le réglage du matériel de traite. Cette situation explique parfaitement l'émergence de la problématique "Danger Lait" observée dans nos résultats. En effet, l'inflammation mammaire chronique entraîne inéluctablement une hausse des cellules somatiques et un recours massif aux antibiotiques, compromettant gravement la qualité sanitaire et commerciale du lait livré aux laiteries.</p>

                <p><strong>Taux de Mortalité :</strong> L'analyse de la mortalité dépeint une réalité hétérogène. Si la moitié des exploitations (Niveau 1) parvient à maintenir des pertes faibles, témoignant d'une conduite zootechnique acceptable, l'autre moitié accuse des taux moyens à élevés. Cette dichotomie suggère que la biosécurité, la gestion de l'alimentation de transition et la prise en charge néonatale (colostrum, hygiène des vêlages) restent des maillons faibles pour une grande partie des éleveurs de la région.</p>

                <h3>4. Défis Reproductifs et Risque Zoonotique</h3>
                <p>Le volet de la reproduction est sans doute le plus préoccupant. Les praticiens rapportent unanimement des fréquences d'avortements allant de moyennes (majorité des cas) à élevées.</p>
                <p>Ce tableau clinique est d'autant plus complexe que les stades d'avortement sont variables (60% des cas). Cette variabilité temporelle complique énormément l'orientation du diagnostic étiologique sur le terrain (causes infectieuses, parasitaires ou nutritionnelles).</p>
                <p>Toutefois, la confirmation de la présence de la Brucellose dans 20% des élevages lève le voile sur une partie de ce mystère. Cette prévalence, très significative, dépasse le simple cadre zootechnique pour devenir un enjeu majeur de santé publique (zoonose). Elle justifie à elle seule la persistance des troubles reproductifs et impose une vigilance extrême lors des manipulations obstétricales.</p>

                <h3>5. Conclusion</h3>
                <p>En définitive, le modèle d'élevage bovin dans la wilaya de Blida s'appuie sur une flexibilité zootechnique intelligente (races et productions mixtes). Cependant, cette rentabilité est lourdement grevée par des pathologies d'élevage endémiques. L'omniprésence des mammites et la fréquence des avortements (avec la menace sous-jacente de la Brucellose) soulignent l'urgence de passer d'une médecine vétérinaire purement curative à une approche préventive. L'instauration de programmes rigoureux de prophylaxie, le dépistage systématique et la vulgarisation des bonnes pratiques d'hygiène s'imposent comme les seuls leviers capables de pérenniser cette filière stratégique.</p>
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
                discussion: "المناقشة والاستنتاج"
            },
            labels: {
                breeds: ['محلي', 'مختلط', 'أجنبي'],
                production: ['لحم', 'حليب', 'مختلط'],
                disease: ['التهاب الضرع', 'الحمى المالطية', 'خطر الحليب'],
                abortionFreq: (k) => `المستوى ${k}`,
                abortionStage: ['بداية', 'وسط', 'نهاية', 'متغير'],
                mortality: (k) => `المستوى ${k}`,
                occurrences: 'الحالات المرصودة',
                count: 'العدد'
            },
            comments: {
                title: "تحليل",
                breeds: "يتكون القطيع بشكل شبه حصري من سلالات مختلطة (95٪)، مع غياب شبه كامل للسلالات المحلية أو الأجنبية الصافية، مما يشير إلى استراتيجية تهجين واسعة النطاق لتحسين المقاومة والإنتاج.",
                production: "نظام التربية السائد هو النظام المختلط (حليب ولحم - 85٪)، مما يؤكد تعدد الأغراض الذي يبحث عنه المربون في المنطقة لتأمين دخلهم.",
                disease: "التهاب الضرع (Les mammites) موجود في كل مكان تقريبًا (يصيب 95٪ من المزارع)، ويمثل المشكلة الصحية الرئيسية. الحمى المالطية (Brucellose) موجودة في 20٪ من الحالات، وهي نسبة تدعو للقلق.",
                abortionFreq: "حالات الإجهاض متكررة، حيث أبلغ غالبية الأطباء البيطريين عن تواتر متوسط (المستوى 2) إلى مرتفع، مما يسلط الضوء على مشكلة تناسلية مستمرة مرتبطة على الأرجح بالأمراض المرصودة.",
                abortionStage: "تحدث عمليات الإجهاض في مراحل متغيرة بالنسبة لغالبية الحالات (60٪)، مما يعقد التشخيص الدقيق للسبب (معدي مقابل غذائي) دون تحليلات مخبرية.",
                mortality: "على الرغم من أن ما يقرب من 50٪ من الحالات تشير إلى معدل وفيات منخفض، إلا أن النصف الآخر يبلغ عن معدلات متوسطة إلى مرتفعة (خاصة المستوى 3 في 20٪ من الحالات)، مما يشير إلى وجود هامش كبير للتحسن في الإدارة الصحية وحديثي الولادة."
            },
            discussion: `
                <h3>1. مقدمة وسياق الدراسة</h3>
                <p>يقدم هذا التحقيق الوبائي خريطة محدثة للمعايير الزوتقنية والصحية لمزارع الماشية في ولاية البليدة. على الرغم من أن المنطقة تتمتع بإمكانات زراعية لا يمكن إنكارها، إلا أن جمع البيانات اصطدم بتحديات متأصلة في الطب البيطري الميداني: عزلة بعض المزارع، تردد المربين أو محدودية توفرهم، بالإضافة إلى التحيزات المرتبطة بالتاريخ المرضي المصرح به فقط. ومع ذلك، يسمح التحليل المتقاطع للنتائج التي تم الحصول عليها بتحديد الاتجاهات الرئيسية لإدارة القطيع الإقليمي، والتي ستتم مناقشتها في ثلاثة محاور رئيسية.</p>

                <h3>2. الملف الزوتقني واستراتيجية التربية</h3>
                <p>يكشف تحليل هيكل القطيع عن توجه واضح وعملي للمربين. نلاحظ أغلبية ساحقة من السلالات المختلطة (95٪)، مقترنة بإنتاج مختلط (لحم وحليب - 85٪). هذه الملاحظة ليست صدفة؛ إنها تترجم استراتيجية حقيقية للمرونة الاقتصادية. في سياق تتقلب فيه أسعار المدخلات (الأعلاف) وحيث يمكن أن يكون سوق الحليب غير مستقر، يسمح التنوع الجيني للمربي بالعمل على جبهتين. يصبح عجل التسمين بالتالي تأميناً مالياً، يعمل كممتص للصدمات في حالة انخفاض إنتاج الحليب أو الحجز الصحي.</p>

                <h3>3. الحصيلة الصحية وإدارة التربية</h3>
                <p>يبرز الجدول السريري العام فجوات كبيرة في الإدارة الصحية اليومية:</p>
                
                <p><strong>خطر الضرع وجودة الحليب:</strong> يسود التهاب الضرع بشكل مطلق مع انتشار يصيب 95٪ من المزارع. هذا المعدل المقلق هو مؤشر مباشر على نقص صارخ في نظافة الحلب، إدارة الفرشة أو ضبط معدات الحلب. يفسر هذا الوضع تمامًا ظهور مشكلة "خطر الحليب" الملاحظة في نتائجنا. في الواقع، يؤدي التهاب الضرع المزمن حتماً إلى ارتفاع الخلايا الجسدية واللجوء المكثف للمضادات الحيوية، مما يعرض الجودة الصحية والتجارية للحليب المسلم للملابن للخطر الشديد.</p>

                <p><strong>معدل الوفيات:</strong> يصور تحليل الوفيات واقعاً غير متجانس. إذا كان نصف المزارع (المستوى 1) ينجح في الحفاظ على خسائر منخفضة، مما يشهد على إدارة زوتقنية مقبولة، فإن النصف الآخر يعاني من معدلات متوسطة إلى مرتفعة. يشير هذا التباين إلى أن الأمن الحيوي، وإدارة التغذية الانتقالية والرعاية بحديثي الولادة (اللبأ، نظافة الولادات) تظل حلقات ضعيفة لجزء كبير من مربي المنطقة.</p>

                <h3>4. التحديات التناسلية والمخاطر حيوانية المنشأ</h3>
                <p>مما لا شك فيه أن جانب التكاثر هو الأكثر إثارة للقلق. يبلغ الممارسون بالإجماع عن ترددات إجهاض تتراوح من متوسطة (غالبية الحالات) إلى مرتفعة.</p>
                <p>هذا الجدول السريري أكثر تعقيدًا لأن مراحل الإجهاض متغيرة (60٪ من الحالات). يعقد هذا التباين الزمني بشكل كبير توجيه التشخيص المسببي في الميدان (أسباب معدية، طفيلية أو غذائية).</p>
                <p>ومع ذلك، فإن تأكيد وجود الحمى المالطية (Brucellose) في 20٪ من المزارع يكشف النقاب عن جزء من هذا الغموض. يتجاوز هذا الانتشار الكبير جداً الإطار الزوتقني البسيط ليصبح قضية رئيسية للصحة العامة (مرض حيواني المنشأ). إنه يبرر بمفرده استمرار الاضطرابات التناسلية ويفرض يقظة قصوى أثناء التدخلات التوليدية.</p>

                <h3>5. الخاتمة</h3>
                <p>في الختام، يعتمد نموذج تربية الماشية في ولاية البليدة على مرونة زوتقنية ذكية (سلالات وإنتاج مختلط). ومع ذلك، فإن هذه الربحية مثقلة بشدة بأمراض التربية المستوطنة. يؤكد انتشار التهاب الضرع وتواتر الإجهاض (مع التهديد الكامن للحمى المالطية) على الحاجة الملحة للانتقال من الطب البيطري العلاجي البحت إلى نهج وقائي. يفرض إنشاء برامج صارمة للوقاية، والكشف المنهجي ونشر ممارسات النظافة الجيدة نفسها كأدوات وحيدة قادرة على استدامة هذا القطاع الاستراتيجي.</p>
            `
        }
    };

    // --- Switch Language Function ---
    window.setLanguage = (lang) => {
        const t = translations[lang];
        const isRTL = lang === 'ar';
        const html = document.documentElement;

        html.dir = isRTL ? 'rtl' : 'ltr';
        html.lang = lang;

        // Update Text Content
        document.getElementById('page-title').innerText = t.title;
        document.getElementById('page-subtitle').innerText = t.subtitle;
        document.getElementById('discussion-title').innerText = t.titles.discussion;

        // Update Comment Titles
        document.querySelectorAll('.comment-title').forEach(el => el.innerText = t.comments.title);

        // Update Chart Titles & Comments
        const chartIds = ['breeds', 'production', 'disease', 'abortionFreq', 'abortionStage', 'mortality'];
        const chartKeys = ['breeds', 'production', 'disease', 'abortionFreq', 'abortionStage', 'mortality'];

        chartIds.forEach((id, index) => {
            const key = chartKeys[index];
            const titleEl = document.getElementById(`title-${id === 'abortionFreq' ? 'abortion-freq' : id === 'abortionStage' ? 'abortion-stage' : id}`);
            if (titleEl) titleEl.innerText = t.titles[key];

            const commentEl = document.getElementById(`comment-${id === 'abortionFreq' ? 'abortion-freq' : id === 'abortionStage' ? 'abortion-stage' : id}`);
            if (commentEl) commentEl.innerText = t.comments[key];
        });

        // Update Discussion Content
        document.getElementById('discussion-content').innerHTML = t.discussion;

        // Update Buttons
        document.querySelectorAll('.lang-switch button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`.lang-switch button[onclick="setLanguage('${lang}')"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Re-render charts with new labels
        renderCharts(lang);
    };

    function renderCharts(lang) {
        const t = translations[lang];
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: lang === 'ar' ? 'Cairo' : 'Roboto'
                        }
                    }
                },
                tooltip: {
                    titleFont: { family: lang === 'ar' ? 'Cairo' : 'Roboto' },
                    bodyFont: { family: lang === 'ar' ? 'Cairo' : 'Roboto' }
                }
            }
        };

        // Helper to destroy old charts
        Object.values(charts).forEach(chart => {
            if (chart) chart.destroy();
        });

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
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    x: { ticks: { font: { family: lang === 'ar' ? 'Cairo' : 'Roboto' } } }
                }
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
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    x: { ticks: { font: { family: lang === 'ar' ? 'Cairo' : 'Roboto' } } }
                }
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
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    x: { ticks: { font: { family: lang === 'ar' ? 'Cairo' : 'Roboto' } } }
                }
            }
        });
    }

    // Initialize with French (Default)
    setLanguage('fr');
});
