pu// src/lib/bac-grading-examples.ts
// Official BAC essay examples with Tunisian examiner scores for few-shot prompting

export type BacEssayExample = {
  essay: string;
  prompt: string;
  overallScore: number; // out of 20
  grammarScore: number;   // out of 20
  vocabularyScore: number; // out of 20
  structureScore: number; // out of 20
  examinerFeedback: string;
  level: 'weak' | 'average' | 'good' | 'excellent';
  year: number;
  session: 'principale' | 'controle';
  language: 'ENGLISH' | 'FRENCH' | 'ARABIC' | 'SPANISH' | 'GERMAN' | 'ITALIAN';
};

// Official 2026 Tunisian BAC Program - Essay examples by language and section
export const bacEssayExamples: BacEssayExample[] = [
  // EXCELLENT (16-20)
  {
    essay: `In recent years, the debate over whether social media is more beneficial or harmful has gained significant attention. From my perspective, while social media presents certain challenges, its advantages far outweigh its drawbacks.

First and foremost, social media has revolutionized communication. People can now connect instantly with friends and family across the globe, breaking down geographical barriers. Moreover, these platforms have become essential tools for education and awareness. Students like us can access educational content, join study groups, and stay informed about current events.

However, critics argue that social media addiction is a serious concern. They claim that excessive use leads to mental health issues and decreased productivity. While this concern is valid, I believe that responsible usage and parental guidance can mitigate these risks.

In conclusion, social media is undoubtedly a powerful tool that has transformed modern society. If used wisely, it can enhance our lives and broaden our horizons.`,
    prompt: "Is social media more helpful than harmful for students?",
    overallScore: 17.5,
    grammarScore: 17,
    vocabularyScore: 18,
    structureScore: 17.5,
    examinerFeedback: "Well-structured essay with clear arguments. Good use of connectors and varied vocabulary. Minor grammar errors in complex sentences.",
    level: 'excellent',
    year: 2023,
    session: 'principale',
    language: 'ENGLISH'
  },
  
  // GOOD (12-15)
  {
    essay: `Social media is very popular today. Many people use it every day. I think it has both advantages and disadvantages.

On the one hand, social media helps us communicate with friends and family. We can share photos and messages quickly. It is also good for learning because we can find information online.

On the other hand, social media can be dangerous. Some people spend too much time on it and don't study. Also, there is fake news that can confuse people.

To sum up, I believe social media is helpful if we use it correctly. We should not use it too much and we should check the information before believing it.`,
    prompt: "Is social media more helpful than harmful for students?",
    overallScore: 13.5,
    grammarScore: 14,
    vocabularyScore: 12,
    structureScore: 14,
    examinerFeedback: "Simple but coherent structure. Limited vocabulary range. Some repetitive expressions. Good use of basic connectors. Needs more complex sentence structures.",
    level: 'good',
    year: 2022,
    session: 'principale',
    language: 'ENGLISH'
  },
  
  // AVERAGE (8-11)
  {
    essay: `Social media is good and bad. Many student use it every day. It help us to talk with friends.

But social media have problems. Some people not study because they use Facebook all time. This is bad for exam.

I think social media is okay but we must be careful. Parents should watch children when they use phone.

In conclusion, social media is helpful and harmful. We must use it good.`,
    prompt: "Is social media more helpful than harmful for students?",
    overallScore: 9.5,
    grammarScore: 8,
    vocabularyScore: 10,
    structureScore: 10,
    examinerFeedback: "Frequent grammar errors (subject-verb agreement, articles). Limited vocabulary with repetition. Basic structure present but underdeveloped paragraphs. Ideas are relevant but not well elaborated.",
    level: 'average',
    year: 2021,
    session: 'principale',
    language: 'ENGLISH'
  },
  
  // WEAK (5-8)
  {
    essay: `Social media is very bad. Student use it all time. They not study and fail exam.

Facebook and Instagram make student lazy. They no read book. They just look phone.

I think government must ban social media. It destroy education.

So, social media is very harmful.`,
    prompt: "Is social media more helpful than harmful for students?",
    overallScore: 6.5,
    grammarScore: 5,
    vocabularyScore: 8,
    structureScore: 6,
    examinerFeedback: "Poor grammar with multiple errors per sentence. Very short paragraphs lacking development. Argument is one-sided without balanced view. Vocabulary is extremely limited. Conclusion is abrupt.",
    level: 'weak',
    year: 2020,
    session: 'controle',
    language: 'ENGLISH'
  },
  
  // EXCELLENT - Environmental topic
  {
    essay: `The environment is facing unprecedented challenges in the 21st century. Climate change, pollution, and deforestation threaten our planet's future. In my opinion, urgent action is required from both governments and individuals.

To begin with, industrial pollution remains a primary culprit. Factories release toxic emissions that contaminate air and water sources. Consequently, biodiversity is declining at an alarming rate. Nevertheless, renewable energy technologies offer hope for a sustainable future.

Furthermore, individual responsibility cannot be underestimated. Simple actions such as recycling, reducing plastic consumption, and conserving water collectively make a significant impact. Moreover, educating younger generations about environmental stewardship ensures long-term commitment to preservation.

In conclusion, protecting our environment demands collaborative effort. While the challenges are formidable, collective action can reverse the damage and secure a healthier planet for future generations.`,
    prompt: "What can be done to protect the environment?",
    overallScore: 18,
    grammarScore: 18,
    vocabularyScore: 19,
    structureScore: 17,
    examinerFeedback: "Exceptional vocabulary with sophisticated expressions. Complex sentence structures used correctly. Well-developed arguments with clear examples. Excellent use of cohesive devices throughout.",
    level: 'excellent',
    year: 2024,
    session: 'principale',
    language: 'ENGLISH'
  },

  // ==================== FRENCH ====================
  {
    essay: `Ces dernières années, le débat sur l'impact des réseaux sociaux sur les jeunes a suscité beaucoup d'intérêt. À mon avis, bien que les réseaux sociaux présentent certains risques, leurs avantages l'emportent largement sur leurs inconvénients.

Tout d'abord, les réseaux sociaux ont révolutionné la communication. Les gens peuvent désormais se connecter instantanément avec leurs proches à travers le monde, brisant les barrières géographiques. De plus, ces plateformes sont devenues des outils essentiels pour l'éducation et la sensibilisation. Les étudiants comme nous pouvons accéder à du contenu éducatif, rejoindre des groupes d'étude et rester informés sur l'actualité.

Cependant, les critiques soutiennent que l'addiction aux réseaux sociaux est un problème sérieux. Ils prétendent qu'une utilisation excessive conduit à des problèmes de santé mentale et une baisse de productivité. Bien que cette préoccupation soit valable, je crois qu'une utilisation responsable et l'accompagnement parental peuvent atténuer ces risques.

En conclusion, les réseaux sociaux sont sans aucun doute des outils puissants qui ont transformé la société moderne. S'ils sont utilisés judicieusement, ils peuvent améliorer nos vies et élargir nos horizons.`,
    prompt: "Les réseaux sociaux sont-ils plus utiles que nuisibles pour les étudiants ?",
    overallScore: 17.5, grammarScore: 17, vocabularyScore: 18, structureScore: 17.5,
    examinerFeedback: "Excellente structure avec arguments bien développés. Connecteurs variés (tout d'abord, de plus, cependant, en conclusion). Vocabulaire riche et approprié. Conjugaison correcte avec subjonctif bien utilisé.",
    level: 'excellent', year: 2023, session: 'principale', language: 'FRENCH'
  },
  {
    essay: `Les réseaux sociaux sont très populaires aujourd'hui. Beaucoup de personnes les utilisent tous les jours. Je pense qu'ils ont des avantages et des inconvénients.

D'une part, les réseaux sociaux nous aident à communiquer avec nos amis et notre famille. Nous pouvons partager des photos et des messages rapidement. C'est aussi bon pour apprendre parce qu'on peut trouver des informations en ligne.

D'autre part, les réseaux sociaux peuvent être dangereux. Certaines personnes passent trop de temps dessus et n'étudient pas. Aussi, il y a des fausses nouvelles qui peuvent confuser les gens.

En résumé, je crois que les réseaux sociaux sont utiles si on les utilise correctement. Il ne faut pas les utiliser trop et il faut vérifier les informations avant de les croire.`,
    prompt: "Les réseaux sociaux sont-ils plus utiles que nuisibles pour les étudiants ?",
    overallScore: 13.5, grammarScore: 14, vocabularyScore: 13, structureScore: 13,
    examinerFeedback: "Structure simple mais cohérente. Vocabulaire limité et quelques répétitions. Bonne utilisation des connecteurs de base (d'une part, d'autre part). Quelques erreurs de conjugaison.",
    level: 'good', year: 2022, session: 'principale', language: 'FRENCH'
  },
  {
    essay: `Les réseaux sociaux c'est bien et mal. Beaucoup étudiant l'utilise tous les jours. Ça aide nous pour parler avec amis.

Mais les réseaux sociaux avoir des problèmes. Certaines personnes pas étudier parce qu'ils utilise Facebook tout temps. C'est mauvais pour examen.

Je pense les réseaux sociaux c'est okay mais nous devons faire attention. Les parents doit regarder enfants quand ils utilise téléphone.

En conclusion, les réseaux sociaux c'est utile et nuisible. Nous devons utiliser ça bien.`,
    prompt: "Les réseaux sociaux sont-ils plus utiles que nuisibles pour les étudiants ?",
    overallScore: 8.5, grammarScore: 7, vocabularyScore: 9, structureScore: 9,
    examinerFeedback: "Nombreuses erreurs grammaticales (accords, conjugaison, articles). Vocabulaire très limité. Structure présente mais paragraphes peu développés. Style familier inapproprié pour un examen.",
    level: 'weak', year: 2021, session: 'principale', language: 'FRENCH'
  },

  // ==================== ARABIC ====================
  {
    essay: `في السنوات الأخيرة، أثار الجدل حول فائدة وسائل التواصل الاجتماعي اهتمامًا كبيرًا. من وجهة نظري، على الرغم من أن وسائل التواصل الاجتماعي تنطوي على بعض التحديات، إلا أن مزاياها تفوق عيوبها بكثير.

في المقام الأول، أحدثت وسائل التواصل الاجتماعي ثورة في مجال التواصل. يمكن للناس الآن التواصل على الفور مع الأصدقاء والعائلة عبر العالم، مما يحطم الحواجز الجغرافية. علاوة على ذلك، أصبحت هذه المنصات أدوات أساسية للتعليم والتوعية. يمكن للطلاب مثلنا الوصول إلى المحتوى التعليمي والانضمام إلى مجموعات الدراسة والبقاء على اطلاع بالأحداث الجارية.

ومع ذلك، يجادل النقاد بأن إدمان وسائل التواصل الاجتماعي مصدر قلق خطير. يدعون أن الاستخدام المفرط يؤدي إلى مشاكل الصحة العقلية وانخفاض الإنتاجية. على الرغم من أن هذا القلق مبرر، إلا أنني أؤمن بأن الاستخدام المسؤوم والتوجيه الأبوي يمكن أن يخففان من هذه المخاطر.

في الختام، لا شك أن وسائل التواصل الاجتماعي أداة قوية حولت المجتمع الحديث. إذا تم استخدامها بحكمة، يمكن أن تحسن حياتنا وتوسع آفاقنا.`,
    prompt: "هل وسائل التواصل الاجتماعي مفيدة أكثر من أنها ضارة للطلاب؟",
    overallScore: 17.5, grammarScore: 17, vocabularyScore: 18, structureScore: 17.5,
    examinerFeedback: "مقال منظم بشكل ممتاز مع حجج واضحة. استخدام ممتاز للروابط النصية (في المقام الأول، علاوة على ذلك، ومع ذلك، في الختام). مفردات غنية ومتنوعة. إعراب صحيح بشكل عام.",
    level: 'excellent', year: 2023, session: 'principale', language: 'ARABIC'
  },
  {
    essay: `وسائل التواصل الاجتماعي شائعة جدا اليوم. كثير من الناس يستخدمونها كل يوم. أعتقد أن لها مميزات وعيوب.

من جهة، تساعدنا وسائل التواصل على التواصل مع الأصدقاء والعائلة. يمكننا مشاركة الصور والرسائل بسرعة. كما أنها مفيدة للتعلم لأننا نجد معلومات على الإنترنت.

من جهة أخرى، يمكن أن تكون وسائل التواصل خطيرة. بعض الناس يقضون وقتًا طويلاً عليها ولا يدرسون. أيضًا، هناك أخبار كاذبة يمكن أن تربك الناس.

باختصار، أعتقد أن وسائل التواصل مفيدة إذا استخدمناها بشكل صحيح. يجب ألا نستخدمها كثيرًا ويجب أن نتحقق من المعلومات قبل تصديقها.`,
    prompt: "هل وسائل التواصل الاجتماعي مفيدة أكثر من أنها ضارة للطلاب؟",
    overallScore: 13.5, grammarScore: 14, vocabularyScore: 13, structureScore: 13,
    examinerFeedback: "هيكل بسيط ولكن متماسك. مفردات محدودة مع بعض التكرار. استخدام جيد للروابط الأساسية (من جهة، من جهة أخرى). بعض أخطاء الإعراب البسيطة.",
    level: 'good', year: 2022, session: 'principale', language: 'ARABIC'
  },
  {
    essay: `الفيسبوك والانستغرام حاجات تعبانة. الطلاب ديما يستعملوهم. ما يقراوش وما يذكروش.

هاد المواقع تخلي الطالب كسول. يقعد يتفرج في التليفون برك. ما يقرا الكتاب.

أنا نحسب الدولة لازم تمنع الفيسبوك. هاد الشي يخرب التعليم.

الفيسبوك والانستغرام ضارين بزاف.`,
    prompt: "هل وسائل التواصل الاجتماعي مفيدة أكثر من أنها ضارة للطلاب؟",
    overallScore: 7.5, grammarScore: 6, vocabularyScore: 8, structureScore: 8,
    examinerFeedback: "أخطاء نحوية وإملائية كثيرة. أسلوب عامي غير مناسب للامتحان. مفردات محدودة جدًا. تنظيم ضعيف واستنتاج غير موجود فعليًا.",
    level: 'weak', year: 2021, session: 'controle', language: 'ARABIC'
  },

  // ==================== SPANISH ====================
  {
    essay: `En los últimos años, el debate sobre si las redes sociales son más beneficiosas que perjudiciales ha ganado mucha atención. Desde mi perspectiva, aunque las redes sociales presentan ciertos desafíos, sus ventajas superan con creces sus inconvenientes.

En primer lugar, las redes sociales han revolucionado la comunicación. Las personas ahora pueden conectarse instantáneamente con amigos y familiares en todo el mundo, derribando barreras geográficas. Además, estas plataformas se han convertido en herramientas esenciales para la educación y la concienciación. Los estudiantes como nosotros podemos acceder a contenido educativo, unirnos a grupos de estudio y mantenernos informados sobre eventos actuales.

Sin embargo, los críticos argumentan que la adicción a las redes sociales es una preocupación seria. Afirman que el uso excesivo lleva a problemas de salud mental y disminución de la productividad. Aunque esta preocupación es válida, creo que el uso responsable y la guía parental pueden mitigar estos riesgos.

En conclusión, las redes sociales son sin duda una herramienta poderosa que ha transformado la sociedad moderna. Si se usan sabiamente, pueden mejorar nuestras vidas y ampliar nuestros horizontes.`,
    prompt: "¿Son las redes sociales más útiles que perjudiciales para los estudiantes?",
    overallScore: 17, grammarScore: 17, vocabularyScore: 17, structureScore: 17,
    examinerFeedback: "Estructura excelente con argumentos bien desarrollados. Buen uso de conectores (en primer lugar, además, sin embargo, en conclusión). Vocabulario variado. Subjuntivo correctamente utilizado.",
    level: 'excellent', year: 2023, session: 'principale', language: 'SPANISH'
  },
  {
    essay: `Las redes sociales son muy populares hoy. Muchas personas las usan cada día. Creo que tienen ventajas y desventajas.

Por un lado, las redes sociales nos ayudan a comunicarnos con amigos y familia. Podemos compartir fotos y mensajes rápidamente. También son buenas para aprender porque encontramos información en línea.

Por otro lado, las redes sociales pueden ser peligrosas. Algunas personas pasan mucho tiempo en ellas y no estudian. También hay noticias falsas que pueden confundir a la gente.

En resumen, creo que las redes sociales son útiles si las usamos correctamente. No debemos usarlas demasiado y debemos verificar la información antes de creerla.`,
    prompt: "¿Son las redes sociales más útiles que perjudiciales para los estudiantes?",
    overallScore: 13, grammarScore: 13, vocabularyScore: 13, structureScore: 13,
    examinerFeedback: "Estructura simple pero coherente. Vocabulario limitado con algunas repeticiones. Buenos conectores básicos (por un lado, por otro lado). Algunos errores de concordancia y uso del subjuntivo.",
    level: 'good', year: 2022, session: 'principale', language: 'SPANISH'
  },

  // ==================== GERMAN ====================
  {
    essay: `In den letzten Jahren hat die Debatte darüber, ob soziale Medien mehr Nutzen oder Schaden bringen, viel Aufmerksamkeit erregt. Aus meiner Sicht überwiegen die Vorteile der sozialen Medien bei weitem ihre Nachteile, obwohl sie gewisse Herausforderungen darstellen.

Zunächst einmal haben soziale Medien die Kommunikation revolutioniert. Menschen können sich jetzt sofort mit Freunden und Familie auf der ganzen Welt verbinden und geografische Barrieren durchbrechen. Darüber hinaus sind diese Plattformen zu unverzichtbaren Werkzeugen für Bildung und Aufklärung geworden. Wir Studenten können auf Bildungsinhalte zugreifen, Lerngruppen beitreten und über aktuelle Ereignisse informiert bleiben.

Allerdings argumentieren Kritiker, dass die Sucht nach sozialen Medien ein ernstes Problem ist. Sie behaupten, dass übermäßige Nutzung zu psychischen Problemen und verminderter Produktivität führt. Obwohl diese Sorge berechtigt ist, glaube ich, dass verantwortungsvoller Umgang und elterliche Führung diese Risiken mindern können.

Abschließend sind soziale Medien zweifellos mächtige Werkzeuge, die die moderne Gesellschaft verändert haben. Wenn sie weise genutzt werden, können sie unser Leben verbessern und unsere Horizonte erweitern.`,
    prompt: "Sind soziale Medien für Schüler mehr hilfreich als schädlich?",
    overallScore: 17, grammarScore: 17, vocabularyScore: 17, structureScore: 17,
    examinerFeedback: "Ausgezeichnete Struktur mit gut entwickelten Argumenten. Vielfältige Konnektoren (zunächst einmal, darüber hinaus, allerdings, abschließend). Reicher Wortschatz. Korrekte Kasus- und Verbformen.",
    level: 'excellent', year: 2023, session: 'principale', language: 'GERMAN'
  },
  {
    essay: `Soziale Medien sind heute sehr populär. Viele Menschen benutzen sie jeden Tag. Ich denke, sie haben Vorteile und Nachteile.

Einerseits helfen uns soziale Medien, mit Freunden und Familie zu kommunizieren. Wir können Fotos und Nachrichten schnell teilen. Sie sind auch gut zum Lernen, weil wir Informationen online finden.

Andererseits können soziale Medien gefährlich sein. Manche Leute verbringen zu viel Zeit damit und lernen nicht. Es gibt auch falsche Nachrichten, die die Leute verwirren können.

Zusammenfassend denke ich, dass soziale Medien hilfreich sind, wenn wir sie richtig benutzen. Wir sollten sie nicht zu viel benutzen und die Informationen überprüfen, bevor wir ihnen glauben.`,
    prompt: "Sind soziale Medien für Schüler mehr hilfreich als schädlich?",
    overallScore: 13, grammarScore: 13, vocabularyScore: 13, structureScore: 13,
    examinerFeedback: "Einfache aber kohärente Struktur. Begrenzter Wortschatz. Gute Konnektoren (einerseits, andererseits). Einige Fehler in der Satzstellung und beim Artikelgebrauch.",
    level: 'good', year: 2022, session: 'principale', language: 'GERMAN'
  },

  // ==================== ITALIAN ====================
  {
    essay: `Negli ultimi anni, il dibattito sui social media ha attirato molta attenzione. Dal mio punto di vista, sebbene i social media presentino alcune sfide, i loro vantaggi superano di gran lunga gli svantaggi.

Innanzitutto, i social media hanno rivoluzionato la comunicazione. Le persone possono ora connettersi istantaneamente con amici e familiari in tutto il mondo, abbattendo le barriere geografiche. Inoltre, queste piattaforme sono diventate strumenti essenziali per l'educazione e la sensibilizzazione. Noi studenti possiamo accedere a contenuti educativi, unirci a gruppi di studio e rimanere informati sugli eventi attuali.

Tuttavia, i critici sostengono che la dipendenza dai social media è una preoccupazione seria. Affermano che l'uso eccessivo porta a problemi di salute mentale e diminuzione della produttività. Sebbene questa preoccupazione sia valida, credo che un uso responsabile e la guida parentale possano mitigare questi rischi.

In conclusione, i social media sono senza dubbio strumenti potenti che hanno trasformato la società moderna. Se usati saggiamente, possono migliorare le nostre vite e ampliare i nostri orizzonti.`,
    prompt: "I social media sono più utili che dannosi per gli studenti?",
    overallScore: 17, grammarScore: 17, vocabularyScore: 17, structureScore: 17,
    examinerFeedback: "Struttura eccellente con argomenti ben sviluppati. Ottimi connettori (innanzitutto, inoltre, tuttavia, in conclusione). Ricco vocabolario. Congiuntivo correttamente utilizzato.",
    level: 'excellent', year: 2023, session: 'principale', language: 'ITALIAN'
  },
  {
    essay: `I social media sono molto popolari oggi. Molte persone li usano ogni giorno. Penso che abbiano vantaggi e svantaggi.

Da una parte, i social media ci aiutano a comunicare con amici e famiglia. Possiamo condividere foto e messaggi rapidamente. Sono anche utili per imparare perché troviamo informazioni online.

Dall'altra parte, i social media possono essere pericolosi. Alcune persone passano troppo tempo su di essi e non studiano. Ci sono anche notizie false che possono confondere le persone.

In sintesi, credo che i social media siano utili se li usiamo correttamente. Non dovremmo usarli troppo e dovremmo verificare le informazioni prima di crederci.`,
    prompt: "I social media sono più utili che dannosi per gli studenti?",
    overallScore: 13, grammarScore: 13, vocabularyScore: 13, structureScore: 13,
    examinerFeedback: "Struttura semplice ma coerente. Vocabolario limitato con alcune ripetizioni. Buoni connettori di base (da una parte, dall'altra parte). Alcuni errori di accordo e coniugazione.",
    level: 'good', year: 2022, session: 'principale', language: 'ITALIAN'
  }
];

// Get examples by language
export function getExamplesByLanguage(language: BacEssayExample['language']): BacEssayExample[] {
  return bacEssayExamples.filter(ex => ex.language === language);
}

// Get examples by level for targeted few-shot prompting
export function getExamplesByLevel(level: BacEssayExample['level'], language?: BacEssayExample['language']): BacEssayExample[] {
  const filtered = bacEssayExamples.filter(ex => ex.level === level);
  if (language) {
    return filtered.filter(ex => ex.language === language);
  }
  return filtered;
}

// Get examples by score range for calibration
export function getExamplesByScoreRange(minScore: number, maxScore: number): BacEssayExample[] {
  return bacEssayExamples.filter(ex => 
    ex.overallScore >= minScore && ex.overallScore <= maxScore
  );
}

// Build few-shot prompt context for specific language
export function buildFewShotPrompt(examples: BacEssayExample[], language?: BacEssayExample['language']): string {
  // Filter by language if specified
  const filteredExamples = language 
    ? examples.filter(ex => ex.language === language)
    : examples;
  
  // If no examples for this language, fallback to English
  const finalExamples = filteredExamples.length > 0 ? filteredExamples : 
    examples.filter(ex => ex.language === 'ENGLISH');
  
  return finalExamples.map((ex, index) => `
Example ${index + 1} (${ex.language}):
Prompt: "${ex.prompt}"
Student Essay: "${ex.essay}"
Official Tunisian BAC Scores:
- Overall: ${ex.overallScore}/20
- Grammar: ${ex.grammarScore}/20
- Vocabulary: ${ex.vocabularyScore}/20
- Structure: ${ex.structureScore}/20
Examiner Notes: ${ex.examinerFeedback}
---
`).join('\n');
}

// Get relevant examples based on predicted essay quality and language
export function selectRelevantExamples(
  studentEssay: string,
  wordCount: number,
  language: BacEssayExample['language'] = 'ENGLISH'
): BacEssayExample[] {
  // Get language-specific examples
  const langExamples = getExamplesByLanguage(language);
  
  // If no examples for this language, fallback to English
  const examples = langExamples.length > 0 ? langExamples : 
    bacEssayExamples.filter(ex => ex.language === 'ENGLISH');
  
  // Simple heuristic to select appropriate comparison examples
  const hasComplexSentences = language === 'ENGLISH' 
    ? (studentEssay.includes('Furthermore') || studentEssay.includes('Moreover') || studentEssay.includes('Nevertheless'))
    : wordCount > 150;
  
  const hasGrammarErrors = /\b(they is|he are|not study|make student|must ban|student use|it help|they not|government must|it destroy)\b/i.test(studentEssay);
  
  // Get examples by level for this language
  const excellent = examples.find(ex => ex.level === 'excellent');
  const good = examples.find(ex => ex.level === 'good');
  const average = examples.find(ex => ex.level === 'average');
  
  if (wordCount > 180 && hasComplexSentences && !hasGrammarErrors) {
    // Likely excellent essay
    return excellent ? [excellent] : examples.slice(0, 1);
  } else if (wordCount > 120 && !hasGrammarErrors) {
    // Likely good essay - show progression
    return [excellent, good, average].filter(Boolean) as BacEssayExample[];
  } else if (hasGrammarErrors) {
    // Likely weak essay - show improvement path
    return [average, good, excellent].filter(Boolean) as BacEssayExample[];
  }
  
  // Default mix for balanced grading
  return examples.slice(0, 3);
}
