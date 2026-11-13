import { SubjectSummary, QuizTest, InteractiveDeck } from '../types';

export const SAMPLE_6TH_GRADE_SUMMARIES: SubjectSummary[] = [
  {
    id: 'ozet-1-gunes-sistemi',
    unitNumber: 1,
    unitTitle: '1. Ünite: Güneş Sistemi ve Tutulmalar',
    topicTitle: 'Güneş Sistemi, Gezegenler ve Asteroitler',
    grade: '6. Sınıf',
    subject: 'Fen Bilimleri',
    mebOutcomes: [
      'F.6.1.1.1. Güneş sistemindeki gezegenleri Güneş\'e yakınlıklarına göre sıralar ve özelliklerini karşılaştırır.',
      'F.6.1.1.2. Güneş sistemindeki gezegenleri karasal ve gazsal olarak sınıflandırır.',
      'F.6.1.2.1. Meteor, gök taşı ve asteroit kavramlarını açıklar.'
    ],
    summaryContent: `### 1. Güneş Sistemi ve Gezegenler
Güneş sistemi; merkezde Güneş, onun etrafında belirli eliptik yörüngelerde dolanan 8 gezegen, bu gezegenlerin uyduları, cüce gezegenler, asteroitler, meteorlar ve kuyruklu yıldızlardan oluşur.

Güneş'e olan uzaklıklarına göre gezegenlerin sıralaması:
1. Merkür
2. Venüs
3. Dünya
4. Mars
5. Jüpiter
6. Satürn
7. Uranüs
8. Neptün

*(Kodlama: **M**eraklı **V**eli **D**ün **M**açta **J**öleli **S**ayfayı **U**nutup **N**ereye gitti?)*

---

### 2. Gezegenlerin Sınıflandırılması

#### A) Karasal (İç) Gezegenler:
- Merkür, Venüs, Dünya ve Mars'tır.
- Katı taş ve kayaç yüzeye sahiptirler.
- Yoğunlukları gazsal gezegenlere göre daha fazladır.
- Halka yapıları kesinlikle yoktur.
- Uydu sayıları azdır (Merkür ve Venüs'ün hiç uydusu yoktur; Dünya'nın 1, Mars'ın 2 uydusu vardır).

#### B) Gazsal (Dış) Gezegenler:
- Jüpiter, Satürn, Uranüs ve Neptün'dür.
- Esas olarak gaz (hidrojen, helyum) katmanlarından meydana gelirler.
- Boyut ve kütle olarak karasal gezegenlerden çok daha büyüktürler.
- Hepsinde halka sistemi bulunur (Satürn'ün halkaları en belirgindir).
- Uydu sayıları oldukça fazladır.

---

### 3. Gezegenlerin Önemli Ayırt Edici Özellikleri
- **Merkür:** Güneş'e en yakın ve sistemin en küçük gezegenidir. Atmosferi neredeyse yoktur. Gece ile gündüz sıcaklık farkı en yüksek gezegendir.
- **Venüs:** "Çoban Yıldızı" olarak bilinir. Çok kalın karbondioksit atmosferi nedeniyle aşırı sera etkisi yaşanır; sistemin en sıcak gezegenidir (~460 °C). Kendi ekseni etrafında diğer gezegenlerin tersi yönünde (doğudan batıya) döner.
- **Dünya:** Üzerinde canlı yaşamının varlığı bilinen tek gezegendir. 1 uydusu (Ay) vardır.
- **Mars:** Yüzeyindeki bol demir oksitten ötürü "Kızıl Gezegen" olarak adlandırılır. 2 küçük uydusu (Phobos ve Deimos) bulunur.
- **Jüpiter:** Güneş sisteminin kütle ve hacimce en büyük ("dev") gezegenidir. Kırmızı Büyük Leke adında asırlardır süren devasa fırtınaya sahiptir.
- **Satürn:** En görkemli ve parlak buz/kayaç halkalarına sahip gezegendir. En büyük uydusu Titan'dır.
- **Uranüs:** Yuvarlanan bir varil gibi yan yatmış eksenle (98° eğiklik) döner. Açık mavi-yeşil renklidir (metan gazı içerir).
- **Neptün:** Güneş'e en uzak gezegendir. Lacivert renkli, son derece soğuk ve şiddetli rüzgarlara ev sahipliği yapar.

---

### 4. Asteroit Kuşağı, Meteor ve Gök Taşı
- **Asteroit Kuşağı:** Mars ile Jüpiter yörüngeleri arasında milyonlarca irili ufaklı kayaç ve metal parçasının bulunduğu kuşaktır.
- **Meteor:** Dünya atmosferine girdiğinde sürtünmeden dolayı aşırı ısınıp ışık yayan gök cisimleridir (Halk arasında "yıldız kayması" denir).
- **Gök Taşı (Meteorit):** Atmosferde tamamen yanıp tükenmeyerek yeryüzüne düşmeyi başaran katı meteor parçalarıdır. Düştükleri yerde oluşturdukları çukura ise **Gök Taşı Çukuru** denir.`,
    keyTerms: [
      'Güneş Sistemi',
      'Karasal Gezegenler',
      'Gazsal Gezegenler',
      'Sera Etkisi (Venüs)',
      'Asteroit Kuşağı',
      'Meteor (Yıldız Kayması)',
      'Gök Taşı (Meteorit)'
    ],
    criticalPoints: [
      'Merkür ve Venüs gezegenlerinin hiçbir doğal uydusu ve halkası yoktur.',
      'Güneş\'e en yakın gezegen Merkür olmasına rağmen, en sıcak gezegen yoğun sera etkisi nedeniyle Venüs\'tür!',
      'Gezegenlerin büyüklük sıralaması: Jüpiter > Satürn > Uranüs > Neptün > Dünya > Venüs > Mars > Merkür.',
      'Asteroit kuşağı tam olarak 4. gezegen (Mars) ile 5. gezegen (Jüpiter) arasında yer alır.'
    ],
    estimatedReadMinutes: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ozet-2-vucudumuzdaki-sistemler',
    unitNumber: 2,
    unitTitle: '2. Ünite: Vücudumuzdaki Sistemler',
    topicTitle: 'Destek ve Hareket, Sindirim ve Dolaşım Sistemleri',
    grade: '6. Sınıf',
    subject: 'Fen Bilimleri',
    mebOutcomes: [
      'F.6.2.1.1. Destek ve hareket sistemine ait yapı ve organları açıklar.',
      'F.6.2.2.1. Sindirim sistemini oluşturan yapı ve organların görevlerini açıklar.',
      'F.6.2.3.1. Dolaşım sistemini oluşturan yapı ve organların görevlerini açıklar.'
    ],
    summaryContent: `### 1. Destek ve Hareket Sistemi
İskelet ve kas sistemi olmak üzere iki ana kısımdan oluşur:
- **Kemik Çeşitleri:**
  - *Uzun Kemikler:* Boyu eninden fazla olan kemiklerdir (Uyluk, kaval, kol kemikleri). Sarı kemik iliği sadece uzun kemiklerde bulunur.
  - *Kısa Kemikler:* Boyu, eni ve kalınlığı birbirine yakın kemiklerdir (El ve ayak bilek kemikleri).
  - *Yassı Kemikler:* Kalınlığı az, yüzeyi geniş kemiklerdir (Kafatası, kaburga, leğen, kürek kemikleri).
- **Eklemler:** Oynar eklem (kol, bacak), yarı oynar eklem (omurlar arası), oynamaz eklem (kafatası).
- **Kas Çeşitleri:**
  - *Çizgili (İskelet) Kas:* İstemli çalışır, hızlı kasılır çabuk yorulur, kırmızı renklidir.
  - *Düz Kas:* İç organlarımızda bulunur, istemsiz çalışır, yavaş ve düzenli kasılır, yorulmaz.
  - *Kalp Kası:* Yapı olarak çizgili kasa benzer, çalışma prensibi olarak düz kas gibi istemsiz ve yorulmadan ritmik çalışır.

---

### 2. Sindirim Sistemi
- **Mekanik (Fiziksel) Sindirim:** Besinlerin enzim kullanılmadan sadece temas yüzeyini artırmak amacıyla dişler, kas hareketleri ve safra sıvısı ile küçük parçalara ayrılmasıdır.
- **Kimyasal Sindirim:** Besinlerin enzimler ve su yardımıyla hücre zarından geçebilecek en küçük yapı taşlarına (monomerlerine) kadar parçalanmasıdır.
  - *Karbonhidratlar:* Ağızda (tükürük amilazı) başlar, ince bağırsakta biter.
  - *Proteinler:* Midede (mide öz suyu - pepsin) başlar, ince bağırsakta biter.
  - *Yağlar:* İnce bağırsakta safra ile mekanik olarak, pankreas öz suyu (lipaz) ile kimyasal olarak başlar ve biter.
- **Sindirime Yardımcı Organlar:**
  - *Karaciğer:* Safra üretir (safra enzim DEĞİLDİR, yağları mekanik sindirir).
  - *Pankreas:* Karbonhidrat, yağ ve protein sindiren enzimleri içeren pankreas öz suyunu üretir.
- **Emilim:** Sindirilen besin maddelerinin ince bağırsaktaki parmak benzeri villus (tümür) çıkıntıları ile kana geçmesidir. Kalın bağırsakta su, vitamin ve mineraller emilir; sindirim olmaz!

---

### 3. Dolaşım Sistemi
- **Kalp:** Dört odacıklıdır (Üstte iki kulakçık, altta iki karıncık). Sol taraf her zaman temiz (oksijence zengin), sağ taraf her zaman kirli (karbondioksitçe zengin) kan taşır.
- **Kan Damarları:**
  - *Atardamar:* Kanı kalpten organlara taşır. Genelde temiz kan taşır (İstisna: Akciğer atardamarı kirli kan taşır).
  - *Toplardamar:* Kanı organlardan kalbe getirir. Genelde kirli kan taşır (İstisna: Akciğer toplardamarı temiz kan taşır).
  - *Kılcal Damar:* Hücrelerle kan arasındaki madde ve gaz alışverişini sağlar, en ince damarlardır.
- **Küçük Kan Dolaşımı:** Kalbin sağ karıncığından kirli kan akciğer atardamarıyla akciğere gider, temizlenir ve akciğer toplardamarıyla kalbin sol kulakçığına döner. Amaç: Kanı oksijence temizlemektir.
- **Büyük Kan Dolaşımı:** Kalbin sol karıncığından temiz kan Aort ile tüm vücuda pompalanır, dokularda kirlenir ve ana toplardamarlar ile kalbin sağ kulakçığına döner. Amaç: Dokulara besin ve oksijen taşımaktır.`,
    keyTerms: [
      'Sarı Kemik İliği',
      'Çizgili / Düz / Kalp Kası',
      'Enzim',
      'Safra Sıvısı',
      'Villus (Emilim)',
      'Küçük ve Büyük Dolaşım',
      'Aort Atardamarı'
    ],
    criticalPoints: [
      'Safra sıvısı bir sindirim enzimi DEĞİLDİR; yağların fiziksel (mekanik) sindirimini gerçekleştirir.',
      'Kalın bağırsakta hiçbir besin maddesinin kimyasal sindirimi gerçekleşmez; yalnızca su, mineral ve vitamin emilimi yapılır.',
      'Akciğer atardamarı hariç tüm atardamarlar temiz kan taşır. Akciğer toplardamarı hariç tüm toplardamarlar kirli kan taşır.'
    ],
    estimatedReadMinutes: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const SAMPLE_6TH_GRADE_TESTS: QuizTest[] = [
  {
    id: 'test-1-gunes-sistemi',
    unitNumber: 1,
    unitTitle: '1. Ünite: Güneş Sistemi ve Tutulmalar',
    title: 'Güneş Sistemi ve Gezegenler Uzmanlık Testi',
    description: 'MEB 6. sınıf kazanımlarına uygun, Güneş sistemi gezegenleri, özellikleri ve gök cisimlerini kapsayan 10 soruluk değerlendirme testi.',
    grade: '6. Sınıf',
    subject: 'Fen Bilimleri',
    questions: [
      {
        id: 'q1-1',
        questionNumber: 1,
        questionText: 'Güneş sistemindeki gezegenler Güneş\'e olan yakınlıklarına göre sıralandığında, 4. ve 5. sıralarda yer alan gezegenler aşağıdakilerin hangisinde doğru verilmiştir?',
        options: {
          A: 'Dünya - Jüpiter',
          B: 'Mars - Jüpiter',
          C: 'Venüs - Mars',
          D: 'Mars - Satürn'
        },
        correctAnswer: 'B',
        explanation: 'Güneş\'e yakınlık sıralaması: 1-Merkür, 2-Venüs, 3-Dünya, 4-Mars, 5-Jüpiter, 6-Satürn, 7-Uranüs, 8-Neptün şeklindedir. 4. gezegen Mars, 5. gezegen ise Jüpiter\'dir.'
      },
      {
        id: 'q1-2',
        questionNumber: 2,
        questionText: 'Güneş sisteminde yer alan karasal (iç) gezegenlerle ilgili aşağıdaki ifadelerden hangisi yanlıştır?',
        options: {
          A: 'Katı, kayaç yapılı yüzeye sahiptirler.',
          B: 'Gazsal gezegenlere kıyasla yoğunlukları daha düşüktür.',
          C: 'Halka sistemleri kesinlikle bulunmaz.',
          D: 'Güneş\'e gazsal gezegenlerden daha yakındırlar.'
        },
        correctAnswer: 'B',
        explanation: 'Karasal gezegenler katı taş ve kayaçlardan oluştukları için yoğunlukları gazsal gezegenlere göre daha YÜKSEKTİR. Gaz devleri ise devasa hacimlerine karşın düşük yoğunlukludur.'
      },
      {
        id: 'q1-3',
        questionNumber: 3,
        questionText: 'Güneş\'e en yakın gezegen Merkür olmasına rağmen, Güneş sisteminin yüzey sıcaklığı en yüksek gezegeni Venüs\'tür. Bu durumun temel sebebi aşağıdakilerden hangisidir?',
        options: {
          A: 'Venüs\'ün kendi ekseni etrafında ters yönde dönmesi',
          B: 'Venüs\'ün atmosferindeki aşırı karbondioksit gazının güçlü sera etkisi oluşturması',
          C: 'Venüs\'ün büyüklüğünün Dünya\'ya çok yakın olması',
          D: 'Venüs\'ün Güneş etrafında Merkür\'den daha hızlı dolanması'
        },
        correctAnswer: 'B',
        explanation: 'Venüs\'ün çok kalın atmosferinde yoğun miktarda karbondioksit (CO2) bulunur. Bu gaz Güneş ışınlarını hapsederek kontrolsüz sera etkisi yaratır ve sıcaklığı yaklaşık 460 °C\'ye çıkarır.'
      },
      {
        id: 'q1-4',
        questionNumber: 4,
        questionText: 'Aşağıda verilen gezegen eşleştirmelerinden hangisinin hiçbir doğal uydusu bulunmamaktadır?',
        options: {
          A: 'Merkür ve Venüs',
          B: 'Dünya ve Mars',
          C: 'Venüs ve Mars',
          D: 'Mars ve Jüpiter'
        },
        correctAnswer: 'A',
        explanation: 'Güneş sistemindeki 8 gezegenden sadece Merkür ve Venüs\'ün hiçbir uydusu yoktur. Dünya\'nın 1, Mars\'ın 2, gaz devlerinin ise onlarca uydusu bulunmaktadır.'
      },
      {
        id: 'q1-5',
        questionNumber: 5,
        questionText: 'Kendi ekseni etrafındaki dönme ekseni yaklaşık 98 derece eğik olan ve bu sebeple yörüngesinde "yuvarlanan bir varil gibi" hareket eden gezegen hangisidir?',
        options: {
          A: 'Satürn',
          B: 'Jüpiter',
          C: 'Uranüs',
          D: 'Neptün'
        },
        correctAnswer: 'C',
        explanation: 'Uranüs eksen eğikliği en fazla olan gezegendir (yaklaşık 98 derece). Yan yatmış bir varil gibi yuvarlanarak Güneş etrafında dolanır.'
      },
      {
        id: 'q1-6',
        questionNumber: 6,
        questionText: 'Güneş sistemindeki gezegenler arasında kütle ve hacim bakımından en büyük olan, üzerinde "Büyük Kırmızı Leke" fırtınası gözlemlenen gezegen hangisidir?',
        options: {
          A: 'Satürn',
          B: 'Jüpiter',
          C: 'Neptün',
          D: 'Mars'
        },
        correctAnswer: 'B',
        explanation: 'Jüpiter sistemin en büyük dev gezegenidir. Kırmızı fırtına lekesi Dünya\'dan bile daha geniş çaplı bir atmosfer fırtınasıdır.'
      },
      {
        id: 'q1-7',
        questionNumber: 7,
        questionText: 'Güneş sisteminde yoğun olarak bulunan Asteroit Kuşağı hangi iki gezegenin yörüngeleri arasında konumlanmıştır?',
        options: {
          A: 'Dünya - Mars',
          B: 'Merkür - Venüs',
          C: 'Mars - Jüpiter',
          D: 'Jüpiter - Satürn'
        },
        correctAnswer: 'C',
        explanation: 'Asteroit Kuşağı, iç gezegenler ile dış gezegenlerin sınırı sayılan Mars ile Jüpiter yörüngeleri arasında yer alır.'
      },
      {
        id: 'q1-8',
        questionNumber: 8,
        questionText: 'Halk arasında "yıldız kayması" olarak bilinen gökyüzü olayının gerçek bilimsel açıklaması nedir?',
        options: {
          A: 'Bir yıldızın enerjisini tüketerek uzayda hızla hareket etmesi',
          B: 'Kuyruklu yıldızların Dünya\'ya çok yaklaşarak patlaması',
          C: 'Dünya atmosferine giren meteor parçalarının sürtünmeyle ısınıp arkasında ışıklı iz bırakması',
          D: 'Gezegenlerin yörüngelerinden saparak parlaması'
        },
        correctAnswer: 'C',
        explanation: 'Yıldız kayması olayında hiçbir yıldız yer değiştirmez. Uzaydaki kaya/toz parçaları (meteorlar) Dünya atmosferine hızla girdiğinde havanın sürtünmesiyle akkor hale gelir ve ışık saçar.'
      },
      {
        id: 'q1-9',
        questionNumber: 9,
        questionText: 'Dünya atmosferine girdikten sonra tamamen yanmayıp yeryüzüne düşen katı cisimlere ne ad verilir?',
        options: {
          A: 'Meteorit (Gök Taşı)',
          B: 'Asteroit',
          C: 'Kuyruklu Yıldız',
          D: 'Meteor'
        },
        correctAnswer: 'A',
        explanation: 'Uzaydayken gök cismi, atmosferde yanarken meteor, yeryüzüne ulaşmayı başaran katı kalıntı ise meteorit (gök taşı) olarak adlandırılır.'
      },
      {
        id: 'q1-10',
        questionNumber: 10,
        questionText: 'Aşağıdaki sıralamalardan hangisi gezegenlerin büyüklüklerine (hacimlerine) göre büyükten küçüğe doğru doğru dizilişini gösterir?',
        options: {
          A: 'Jüpiter > Satürn > Uranüs > Neptün > Dünya > Venüs > Mars > Merkür',
          B: 'Güneş > Jüpiter > Dünya > Mars > Satürn > Merkür > Neptün > Venüs',
          C: 'Satürn > Jüpiter > Neptün > Uranüs > Dünya > Venüs > Merkür > Mars',
          D: 'Jüpiter > Uranüs > Satürn > Dünya > Neptün > Mars > Venüs > Merkür'
        },
        correctAnswer: 'A',
        explanation: 'Gezegenlerin büyüklük sıralaması: En büyük 4 gaz devi sırasıyla Jüpiter, Satürn, Uranüs, Neptün; ardından karasal gezegenler Dünya, Venüs, Mars ve en küçük Merkür\'dür.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'test-2-vucudumuzdaki-sistemler',
    unitNumber: 2,
    unitTitle: '2. Ünite: Vücudumuzdaki Sistemler',
    title: 'Vücudumuzdaki Sistemler Değerlendirme Testi',
    description: 'Destek ve hareket, sindirim ve dolaşım sistemleri kazanımlarını ölçen 10 soruluk kapsamlı ünite sınavı.',
    grade: '6. Sınıf',
    subject: 'Fen Bilimleri',
    questions: [
      {
        id: 'q2-1',
        questionNumber: 1,
        questionText: 'Sarı kemik iliği aşağıdaki kemik çeşitlerinden hangisinde bulunur?',
        options: {
          A: 'Yassı kemikler',
          B: 'Kısa kemikler',
          C: 'Yalnızca uzun kemiklerin gövde boşluğunda',
          D: 'Tüm kemik çeşitlerinde ortak olarak'
        },
        correctAnswer: 'C',
        explanation: 'Kırmızı kemik iliği tüm kemik çeşitlerinde bulunurken, yağ depolayan sarı kemik iliği yalnızca uzun kemiklerin (kol ve bacak kemikleri gibi) ilik kanalında yer alır.'
      },
      {
        id: 'q2-2',
        questionNumber: 2,
        questionText: 'Mide, ince bağırsak ve kan damarlarının duvarında bulunan kas çeşidi aşağıdakilerden hangisidir?',
        options: {
          A: 'Çizgili kas',
          B: 'Düz kas',
          C: 'Kalp kası',
          D: 'İskelet kası'
        },
        correctAnswer: 'B',
        explanation: 'İç organların yapısında (kalp hariç) istemsiz çalışan, mekik şekilli hücrelerden oluşan, yavaş ve yorulmadan ritmik çalışan düz kaslar bulunur.'
      },
      {
        id: 'q2-3',
        questionNumber: 3,
        questionText: 'Karaciğer tarafından üretilen safra sıvısı ile ilgili olarak aşağıdakilerden hangisi DOĞRUDUR?',
        options: {
          A: 'Proteinlerin kimyasal sindirimini sağlayan bir enzimdir.',
          B: 'Yağların mekanik (fiziksel) sindirimini sağlayarak yüzey alanını artırır.',
          C: 'Karbonhidratları glikoza parçalar.',
          D: 'Midede salgılanarak besinleri asidik hale getirir.'
        },
        correctAnswer: 'B',
        explanation: 'Safra sıvısı enzim içermez! Görevi, büyük yağ damlalarını küçük damlacıklara bölerek (mekanik sindirim) pankreas enzimlerinin daha hızlı etki etmesini sağlamaktır.'
      },
      {
        id: 'q2-4',
        questionNumber: 4,
        questionText: 'Proteinlerin kimyasal sindirimi hangi organda başlar ve hangi organda tamamlanır?',
        options: {
          A: 'Ağızda başlar - Midede biter',
          B: 'Midede başlar - Kalın bağırsakta biter',
          C: 'Midede başlar - İnce bağırsakta biter',
          D: 'Ağızda başlar - İnce bağırsakta biter'
        },
        correctAnswer: 'C',
        explanation: 'Proteinlerin kimyasal sindirimi midede mide öz suyundaki pepsin enzimiyle başlar, ince bağırsakta pankreas öz suyu enzimleri ile tamamlanır.'
      },
      {
        id: 'q2-5',
        questionNumber: 5,
        questionText: 'Sindirilmiş besin maddelerinin (glikoz, amino asit vb.) kan dolaşımına geçtiği villus (tümür) yapıları hangi organda yer alır?',
        options: {
          A: 'Mide',
          B: 'Kalın bağırsak',
          C: 'İnce bağırsak',
          D: 'Yutak'
        },
        correctAnswer: 'C',
        explanation: 'İnce bağırsağın iç yüzeyinde emilim yüzeyini yüzlerce kat artıran parmak benzeri villus (tümür) çıkıntıları bulunur. Besinler buradan kılcal kan damarlarına geçer.'
      },
      {
        id: 'q2-6',
        questionNumber: 6,
        questionText: 'Kalbin yapısı ve odacıklarıyla ilgili olarak aşağıdaki ifadelerden hangisi yanlıştır?',
        options: {
          A: 'Kalp dört odacıklıdır: İki kulakçık, iki karıncık.',
          B: 'Kalbin sol tarafında her zaman oksijence zengin temiz kan bulunur.',
          C: 'Kalbin sağ tarafında karbondioksitçe zengin kirli kan bulunur.',
          D: 'Kalbin kulakçık kasları, kanı tüm vücuda pompalayan karıncık kaslarından daha kalındır.'
        },
        correctAnswer: 'D',
        explanation: 'Karıncıklar kanı akciğerlere ve tüm vücuda yüksek basınçla pompaladıkları için duvarlarındaki kas tabakası kulakçıklardan çok daha kalındır (özellikle sol karıncık).'
      },
      {
        id: 'q2-7',
        questionNumber: 7,
        questionText: 'Vücudumuzdaki damarlarla ilgili; genellikle temiz kan taşımayan, kirli kanı akciğere götüren istisnai atardamar hangisidir?',
        options: {
          A: 'Aort atardamarı',
          B: 'Akciğer atardamarı',
          C: 'Böbrek atardamarı',
          D: 'Karaciğer atardamarı'
        },
        correctAnswer: 'B',
        explanation: 'Genel kural olarak atardamarlar temiz kan taşır. Bunun tek istisnası kalbin sağ karıncığından çıkıp kirli kanı temizlenmek üzere akciğere götüren Akciğer Atardamarıdır.'
      },
      {
        id: 'q2-8',
        questionNumber: 8,
        questionText: 'Küçük kan dolaşımının temel amacı nedir?',
        options: {
          A: 'Vücut hücrelerine besin ve oksijen dağıtmak',
          B: 'Kirli kanı akciğere gönderip oksijence zenginleştirerek kalbe geri getirmek',
          C: 'Hormonları hedef dokulara iletmek',
          D: 'Vücut sıcaklığını sabit tutmak'
        },
        correctAnswer: 'B',
        explanation: 'Küçük kan dolaşımı; kalp ile akciğer arasında gerçekleşir. Kalbin sağ karıncığından çıkan kirli kan akciğerde karbondioksiti verip oksijen alarak kalbin sol kulakçığına döner.'
      },
      {
        id: 'q2-9',
        questionNumber: 9,
        questionText: 'Kalın bağırsakta gerçekleşen temel süreç aşağıdakilerden hangisidir?',
        options: {
          A: 'Yağların kimyasal sindirimi',
          B: 'Proteinlerin enzimlerle parçalanması',
          C: 'Su, mineral ve bazı vitaminlerin (B ve K) geri emilimi',
          D: 'Safra sıvısının besinlerle karıştırılması'
        },
        correctAnswer: 'C',
        explanation: 'Kalın bağırsakta kimyasal sindirim YAPILMAZ. Sindirilmeyen posa içerisindeki su, mineraller ve bakterilerce sentezlenen B ile K vitaminlerinin geri emilimi gerçekleşir.'
      },
      {
        id: 'q2-10',
        questionNumber: 10,
        questionText: 'Doku ve organlardaki hücreler ile kan arasında madde ve gaz (oksijen - karbondioksit) alışverişini gerçekleştiren en ince damarlar hangileridir?',
        options: {
          A: 'Kılcal damarlar',
          B: 'Aort atardamarları',
          C: 'Ana toplardamarlar',
          D: 'Kapı toplardamarı'
        },
        correctAnswer: 'A',
        explanation: 'Kılcal damarlar tek katlı yassı epitel dokudan oluşur. Kan akışı çok yavaştır ve doku hücreleriyle kan arasındaki difüzyon ve madde alışverişi burada gerçekleşir.'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const SAMPLE_6TH_GRADE_DECKS: InteractiveDeck[] = [
  {
    id: 'slayt-1-gunes-sistemi',
    unitNumber: 1,
    unitTitle: '1. Ünite: Güneş Sistemi ve Tutulmalar',
    title: 'Güneş Sistemi ve Gezegenler - Etkileşimli Eğitim Slaytı',
    description: 'Sesli yapay zeka anlatımlı, görsel destekli ve ara kontrol sorularıyla donatılmış 6. sınıf Güneş Sistemi sunumu.',
    grade: '6. Sınıf',
    subject: 'Fen Bilimleri',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: [
      {
        id: 's1-1',
        order: 1,
        title: 'Güneş Sistemine Hoş Geldiniz!',
        content: 'Güneş sistemi; merkezindeki devasa Güneş ve onun çekim kuvveti etkisiyle yörüngesinde dolanan 8 gezegen, uydular, asteroitler ve gök taşlarından oluşur. Güneş, sistemin ana ısı ve ışık kaynağı olan orta büyüklükte bir yıldızdır.',
        narrationScript: 'Merhaba sevgili öğrenciler! Bugün Güneş Sisteminin büyüleyici derinliklerine doğru bir keşif yolculuğuna çıkıyoruz. Merkezimizde devasa bir yıldız olan Güneş yer alıyor. Onun etrafında ise tam sekiz harika gezegen belirli yörüngelerde durmaksızın dolanmaktadır.',
        bulletPoints: [
          'Merkezde tek bir yıldız: Güneş',
          '8 ana gezegen ve onlarca doğal uydu',
          'Mars ile Jüpiter arasında devasa Asteroit Kuşağı'
        ],
        theme: 'space',
        imageCaption: 'Güneş Sistemi Gezegen Yörüngeleri ve Gökyüzü Modeli'
      },
      {
        id: 's1-2',
        order: 2,
        title: 'Karasal (İç) Gezegenler',
        content: 'Güneş\'e en yakın 4 gezegene "Karasal Gezegenler" veya iç gezegenler denir. Bunlar sırasıyla Merkür, Venüs, Dünya ve Mars\'tır. Hepsi katı taş ve kayaç yüzeylere sahiptir ve halkaları kesinlikle yoktur.',
        narrationScript: 'Şimdi Güneş\'e en yakın ilk dört gezegeni inceleyelim. Merkür, Venüs, Dünya ve Mars. Bu gezegenlerin ortak özelliği, ayak basabileceğiniz katı kayaç bir zemine ve yüksek yoğunluğa sahip olmalarıdır. Ve unutmayın, hiçbir karasal gezegenin etrafında halka bulunmaz.',
        bulletPoints: [
          'Sıralama: Merkür → Venüs → Dünya → Mars',
          'Taş ve kayaç yapı, yüksek yoğunluk',
          'Halka sistemleri kesinlikle yoktur',
          'Merkür ve Venüs\'ün hiç uydusu yoktur'
        ],
        theme: 'space',
        interactiveQuestion: {
          questionText: 'Aşağıdaki gezegenlerden hangisi katı kayaç yüzeye sahip bir Karasal (İç) Gezegendir?',
          options: {
            A: 'Jüpiter',
            B: 'Mars',
            C: 'Satürn',
            D: 'Neptün'
          },
          correctAnswer: 'B',
          explanation: 'Mars, Dünya, Venüs ve Merkür karasal gezegenlerdir. Jüpiter, Satürn ve Neptün ise devasa gazsal gezegenlerdir.'
        }
      },
      {
        id: 's1-3',
        order: 3,
        title: 'Gaz Devleri (Dış Gezegenler)',
        content: 'Asteroit kuşağının ötesinde bulunan Jüpiter, Satürn, Uranüs ve Neptün gazsal gezegenlerdir. Çoğunlukla hidrojen ve helyum gazlarından oluşurlar. Hepsinin halkaları ve çok sayıda uydusu vardır.',
        narrationScript: 'Sıra sistemin devlerine geldi! Jüpiter, Satürn, Uranüs ve Neptün. Bu gezegenler o kadar büyüktür ki onlara Gaz Devleri denir. Katı bir yüzeyleri yoktur; yoğun gaz katmanlarından oluşurlar. En büyüleyici özellikleri ise hepsinin çevresinde dönen halkalara ve çok sayıda uyduya sahip olmalarıdır.',
        bulletPoints: [
          'Jüpiter: Sistemin en büyük kütleli dev gezegeni',
          'Satürn: En belirgin ve parlak buz halkalarına sahip',
          'Uranüs: Eksen eğikliği sebebiyle yuvarlanan bir fıçı gibi döner',
          'Neptün: Güneş\'e en uzak ve en rüzgarlı soğuk gezegen'
        ],
        theme: 'physics'
      },
      {
        id: 's1-4',
        order: 4,
        title: 'Venüs: En Sıcak Gezegenin Sırrı',
        content: 'Güneş\'e en yakın gezegen Merkür olmasına rağmen, Güneş sisteminin yüzey sıcaklığı en yüksek gezegeni Venüs\'tür. Bunun nedeni, Venüs\'ün atmosferindeki aşırı yoğun karbondioksit gazının güçlü bir sera etkisi yaratmasıdır.',
        narrationScript: 'Sınavlarda en çok karıştırılan püf noktaya geldik! Güneşe en yakın gezegen Merkür olmasına rağmen, en sıcak gezegen Venüs\'tür. Çünkü Venüs\'ün atmosferi neredeyse tamamen karbondioksitten oluşur ve bu gaz içeri giren güneş ısısını hapsederek adeta bir düdüklü tencere etkisi yaratır. Sıcaklık 460 dereceyi aşar!',
        bulletPoints: [
          'Güneş\'e en yakın değil ama en sıcaktır (~460 °C)',
          'Yoğun karbondioksit ile kontrolsüz sera etkisi',
          'Halk arasında "Çoban Yıldızı" olarak bilinir',
          'Diğer gezegenlerin tersi yönde (doğudan batıya) döner'
        ],
        theme: 'chemistry',
        interactiveQuestion: {
          questionText: 'Venüs gezegeninin Merkür\'den daha sıcak olmasının ana sebebi nedir?',
          options: {
            A: 'Kendi ekseni etrafında ters dönmesi',
            B: 'Uydusunun bulunmaması',
            C: 'Atmosferindeki yoğun karbondioksitin oluşturduğu sera etkisi',
            D: 'Dünya\'ya çok yakın konumda olması'
          },
          correctAnswer: 'C',
          explanation: 'Venüs\'ün kalın atmosferindeki yüksek karbondioksit gazı güçlü sera etkisi yaparak ısının uzaya kaçmasını engeller ve sıcaklığı yaklaşık 460 °C\'ye çıkarır.'
        }
      },
      {
        id: 's1-5',
        order: 5,
        title: 'Asteroit Kuşağı ve Meteorlar',
        content: 'Mars ile Jüpiter arasında milyonlarca kayaç parçası içeren Asteroit Kuşağı uzanır. Dünya atmosferine giren ve sürtünmeyle ışık saçan meteorlara "yıldız kayması" denir. Yere ulaşan katı parçalara ise meteorit (gök taşı) adı verilir.',
        narrationScript: 'Güneş sistemimizin sessiz gezginleri asteroitler, Mars ile Jüpiter arasındaki geniş kuşakta yer alır. Zaman zaman rotasından çıkıp Dünya atmosferine giren parçalar hava sürtünmesiyle alev alır; biz buna yıldız kayması deriz. Eğer yanıp bitmeden yeryüzüne düşerse, ona gök taşı ya da meteorit diyoruz.',
        bulletPoints: [
          'Asteroit Kuşağı: 4. gezegen (Mars) ile 5. gezegen (Jüpiter) arasında',
          'Meteor (Yıldız Kayması): Atmosferde sürtünmeyle akkor olan kayaç',
          'Gök Taşı (Meteorit): Yeryüzüne çarpmayı başaran katı meteor'
        ],
        theme: 'minimal'
      }
    ]
  },
  {
    id: 'slayt-2-vucudumuzdaki-sistemler',
    unitNumber: 2,
    unitTitle: '2. Ünite: Vücudumuzdaki Sistemler',
    title: 'Dolaşım ve Sindirim Sistemi - Etkileşimli Keşif',
    description: 'Kalbin odacıkları, damarlar, kan dolaşımları ve sindirim aşamalarını etkileşimli slaytlar ve sesli anlatımla öğrenin.',
    grade: '6. Sınıf',
    subject: 'Fen Bilimleri',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slides: [
      {
        id: 's2-1',
        order: 1,
        title: 'Kalbimiz ve Dört Odacığı',
        content: 'Kalp, göğüs boşluğunda sol akciğere daha yakın yerleşmiş, kaslı ve hayati bir pompadır. Üstte iki kulakçık, altta iki karıncık olmak üzere toplam 4 odacıktan oluşur. Sol taraf her zaman temiz, sağ taraf ise kirli kan taşır.',
        narrationScript: 'Vücudumuzun durmaksızın çalışan motoru kalbimizdir. Bir yumruk büyüklüğündeki bu eşsiz organ dört odacıktan oluşur: İki küçük kulakçık ve iki güçlü karıncık. Unutmayın: Kalbimizin sol tarafı her zaman oksijence zengin temiz kan, sağ tarafı ise karbondioksitçe zengin kirli kan taşır.',
        bulletPoints: [
          'Üstte 2 kulakçık, altta 2 karıncık (Toplam 4 odacık)',
          'Sol taraf: Oksijence zengin TEMİZ kan',
          'Sağ taraf: Karbondioksitçe zengin KİRLİ kan',
          'Karıncık duvarları kulakçıklara göre çok daha kaslı ve kalındır'
        ],
        theme: 'biology'
      },
      {
        id: 's2-2',
        order: 2,
        title: 'Küçük ve Büyük Kan Dolaşımı',
        content: 'Küçük dolaşım, kanı akciğerde oksijenle tazelemek için yapılır (Sağ Karıncık → Akciğer Atardamarı → Akciğer → Akciğer Toplardamarı → Sol Kulakçık). Büyük dolaşım ise temiz kanı tüm organlara taşır (Sol Karıncık → Aort → Tüm Vücut → Ana Toplardamar → Sağ Kulakçık).',
        narrationScript: 'Vücudumuzda kan iki ayrı döngüde hareket eder. Birincisi küçük dolaşımdır: Kirli kan kalbin sağ karıncığından çıkıp akciğerlere gider, orada oksijen yüklenip kalbin sol kulakçığına geri döner. Büyük dolaşım ise kalbin sol karıncığından temiz kanı alıp Aort atardamarıyla baştan ayağa tüm dokulara dağıtır.',
        bulletPoints: [
          'Küçük Dolaşım Amacı: Kanı akciğerde temizlemek (oksijenlendirmek)',
          'Büyük Dolaşım Amacı: Dokulara besin ve oksijen ulaştırmak',
          'İstisna: Akciğer atardamarı kirli kan, akciğer toplardamarı temiz kan taşır!'
        ],
        theme: 'biology',
        interactiveQuestion: {
          questionText: 'Küçük kan dolaşımının temel görevi aşağıdakilerden hangisidir?',
          options: {
            A: 'Kanı akciğere götürerek oksijence temizlemek',
            B: 'Sindirilmiş besinleri bağırsaktan karaciğere taşımak',
            C: 'Vücut sıcaklığını düşürmek',
            D: 'Hücrelerden atık maddeleri böbreğe iletmek'
          },
          correctAnswer: 'A',
          explanation: 'Küçük kan dolaşımı kalp ile akciğer arasında gerçekleşir. Temel amacı karbondioksit yüklü kirli kanı akciğer kılcallarında oksijenle tazelemektir.'
        }
      },
      {
        id: 's2-3',
        order: 3,
        title: 'Mekanik ve Kimyasal Sindirim',
        content: 'Mekanik sindirim, besinlerin enzim kullanılmadan fiziksel temas ve kas hareketleriyle küçültülmesidir. Kimyasal sindirim ise su ve özel enzimlerle besinlerin yapı taşlarına parçalanmasıdır.',
        narrationScript: 'Yediğimiz besinlerin hücrelerimize girebilmesi için minik parçalara ayrılması gerekir. Mekanik sindirimde enzim kullanılmaz; dişlerimiz ve kaslarımız besinleri ezer. Kimyasal sindirimde ise enzim denen sihirli makaslar devreye girerek besinleri en küçük yapı taşlarına kadar böler.',
        bulletPoints: [
          'Mekanik: Dişler, mide kasılması ve karaciğerin safra sıvısı',
          'Karbonhidrat Kimyasal: Ağızda başlar, ince bağırsakta biter',
          'Protein Kimyasal: Midede başlar, ince bağırsakta biter',
          'Yağ Kimyasal: İnce bağırsakta pankreas lipaz enzimiyle başlar ve biter'
        ],
        theme: 'chemistry'
      },
      {
        id: 's2-4',
        order: 4,
        title: 'Sindirime Yardımcı Organlar ve Emilim',
        content: 'Karaciğer safra sıvısı üreterek yağları mekanik olarak parçalar (safra enzim DEĞİLDİR!). Pankreas ise tüm besin gruplarını parçalayan enzimleri üretir. Sindirilen besinler ince bağırsaktaki parmak benzeri villus çıkıntıları ile kana geçer.',
        narrationScript: 'Sindirimin gizli kahramanları karaciğer ve pankreastır. Lütfen dikkat: Karaciğerin ürettiği safra bir enzim değildir, sadece yağları küçük damlacıklara böler. Pankreas ise en güçlü sindirim enzimlerini salgılar. Son durakta ise ince bağırsaktaki minik villus tüycükleri besinleri emerek doğrudan kanımıza aktarır.',
        bulletPoints: [
          'Karaciğer safra üretir (Yağların mekanik sindirimi - Enzim DEĞİLDİR!)',
          'Pankreas öz suyu: Karbonhidrat, protein ve yağ sindiren enzimler',
          'İnce bağırsak villusları: Besin emiliminin ana merkezidir',
          'Kalın bağırsak: Sadece su, mineral ve B-K vitaminlerini emer; sindirim yapmaz!'
        ],
        theme: 'biology',
        interactiveQuestion: {
          questionText: 'Karaciğer tarafından üretilen safra sıvısı ile ilgili hangisi DOĞRUDUR?',
          options: {
            A: 'Proteinleri kimyasal olarak sindiren bir enzimdir.',
            B: 'Yağların mekanik (fiziksel) sindirimini gerçekleştirir.',
            C: 'Karbonhidratları glikoza parçalar.',
            D: 'Kalın bağırsakta emilim sağlar.'
          },
          correctAnswer: 'B',
          explanation: 'Safra sıvısı bir enzim değildir; büyük yağ damlalarını mekanik olarak ufalayarak pankreas enzimlerinin daha etkili çalışmasını sağlar.'
        }
      }
    ]
  }
];
