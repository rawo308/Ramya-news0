-- Seed data mirrored from src/lib/mock-data.ts so the real database
-- starts out looking exactly like the front-end mock currently does.

insert into public.categories (slug, label, description, sort_order) values
  ('lebanon',  'لبنان',       'آخر الأخبار والتطورات المحلية في لبنان',        1),
  ('world',    'العالم',      'أهم الأحداث والتطورات على الساحة الدولية',      2),
  ('politics', 'سياسة',       'أخبار الشأن السياسي محلياً وعربياً ودولياً',    3),
  ('economy',  'اقتصاد',      'أسواق المال والاقتصاد المحلي والعالمي',         4),
  ('sports',   'رياضة',       'أخبار الرياضة المحلية والعالمية',               5),
  ('culture',  'منوعات',      'فنون وثقافة ومنوعات',                           6),
  ('tech',     'تكنولوجيا',   'أحدث أخبار التقنية والابتكار',                  7);

insert into public.ticker_items (content, sort_order) values
  ('الحكومة تعقد جلسة طارئة لبحث الملف الاقتصادي صباح اليوم', 1),
  ('ارتفاع أسعار صرف الذهب عالمياً مع تصاعد التوترات', 2),
  ('المنتخب اللبناني يستعد لمواجهة حاسمة الأسبوع المقبل', 3),
  ('اجتماع لوزراء الخارجية العرب لبحث آخر المستجدات الإقليمية', 4);

-- Lead / hero story
insert into public.articles
  (slug, title, excerpt, content, image_url, status, is_featured, featured_position, published_at)
values (
  'majlis-al-wuzara-khutta-islahiya',
  'مجلس الوزراء يقر خطة إصلاحية جديدة لإعادة هيكلة القطاع المالي',
  'أعلنت الحكومة اللبنانية عن حزمة إصلاحات اقتصادية ومالية جديدة تهدف إلى استعادة الثقة بالقطاع المصرفي وتحفيز النمو خلال المرحلة المقبلة، وسط ترقب شعبي واسع لتفاصيل الخطة.',
  E'أعلنت الحكومة اللبنانية عن حزمة إصلاحات اقتصادية ومالية جديدة تهدف إلى استعادة الثقة بالقطاع المصرفي وتحفيز النمو خلال المرحلة المقبلة، وسط ترقب شعبي واسع لتفاصيل الخطة.\n\nوبحسب المعلومات المتوفرة، يأتي هذا التطور في سياق متابعة الملفات ذات الأولوية خلال المرحلة الحالية، حيث تشير المصادر إلى وجود تنسيق مستمر بين الجهات المعنية لضمان سير الأمور وفق الخطة الموضوعة.\n\nمن جهة أخرى، أكدت مصادر مطلعة أن التطورات المقبلة ستكون محل متابعة دقيقة، مشيرة إلى أن أي مستجدات سيتم الإعلان عنها فور توفرها بشكل رسمي عبر القنوات المختصة.',
  'https://picsum.photos/seed/ramyah-lead/1200/800',
  'published', true, 1, now() - interval '20 minutes'
);

insert into public.article_categories (article_id, category_id)
select a.id, c.id from public.articles a, public.categories c
where a.slug = 'majlis-al-wuzara-khutta-islahiya' and c.slug = 'lebanon';

insert into public.articles
  (slug, title, content, image_url, status, is_featured, featured_position, published_at)
values
  ('liqa-mortaqab-farqa-siyasiyeen', 'لقاء مرتقب بين الفرقاء السياسيين لبحث الملفات العالقة',
   E'مصادر تتحدث عن أجواء إيجابية قبيل انعقاد اللقاء.\n\nمن المتوقع أن يتناول اللقاء عدداً من الملفات الداخلية العالقة.',
   'https://picsum.photos/seed/ramyah-politics/600/400', 'published', true, 2, now() - interval '1 hour'),

  ('taafi-sarf-lira-dollar', 'تعافٍ ملحوظ في سعر صرف الليرة مقابل الدولار خلال تعاملات اليوم',
   E'محللون يربطون التحسن بإجراءات المصرف المركزي الأخيرة.\n\nالسوق يترقب مزيداً من الاستقرار خلال الأيام المقبلة.',
   'https://picsum.photos/seed/ramyah-economy/600/400', 'published', true, 3, now() - interval '2 hours'),

  ('qimma-dawliya-istiqrar-mantiqa', 'قمة دولية لبحث سبل تعزيز الاستقرار في المنطقة',
   E'مباحثات موسعة بين عدة وفود لمناقشة أبرز الملفات الإقليمية العالقة.\n\nبيان ختامي متوقع خلال الساعات المقبلة.',
   'https://picsum.photos/seed/ramyah-world/600/400', 'published', true, 4, now() - interval '3 hours');

insert into public.article_categories (article_id, category_id)
select a.id, c.id from public.articles a, public.categories c
where (a.slug, c.slug) in (
  ('liqa-mortaqab-farqa-siyasiyeen', 'politics'),
  ('taafi-sarf-lira-dollar', 'economy'),
  ('qimma-dawliya-istiqrar-mantiqa', 'world')
);

-- Lebanon section
insert into public.articles (slug, title, excerpt, content, image_url, status, published_at) values
  ('baladiyat-beirut-tahil-bunya-tahtiya', 'بلدية بيروت تطلق خطة لتأهيل البنية التحتية في الأحياء القديمة',
   'مشروع جديد يشمل تحسين الطرقات وشبكات الصرف الصحي في عدة مناطق.',
   E'مشروع جديد يشمل تحسين الطرقات وشبكات الصرف الصحي في عدة مناطق.\n\nوبحسب المعلومات المتوفرة، يأتي هذا التطور في سياق متابعة الملفات ذات الأولوية خلال المرحلة الحالية.\n\nمن جهة أخرى، أكدت مصادر مطلعة أن التطورات المقبلة ستكون محل متابعة دقيقة.',
   'https://picsum.photos/seed/ramyah-beirut/600/450', 'published', now() - interval '4 hours'),

  ('arsad-jawiya-tahzir-taqas', 'الأرصاد الجوية تحذر من موجة طقس غير مستقر مطلع الأسبوع',
   'توقعات بهطول أمطار غزيرة ورياح قوية على المناطق الساحلية والجبلية.',
   E'توقعات بهطول أمطار غزيرة ورياح قوية على المناطق الساحلية والجبلية.\n\nالسلطات المحلية تدعو للحيطة والحذر خلال أيام العاصفة.',
   'https://picsum.photos/seed/ramyah-weather/600/450', 'published', now() - interval '5 hours'),

  ('maarid-kitab-sanawi', 'افتتاح معرض الكتاب السنوي بمشاركة أكثر من 200 دار نشر',
   'الفعالية تستمر لمدة أسبوعين وتشمل ندوات ثقافية وأمسيات شعرية.',
   E'الفعالية تستمر لمدة أسبوعين وتشمل ندوات ثقافية وأمسيات شعرية.\n\nإقبال جماهيري واسع منذ ساعات الافتتاح الأولى.',
   'https://picsum.photos/seed/ramyah-book/600/450', 'published', now() - interval '6 hours'),

  ('hamla-tawiya-tarshid-kahraba', 'حملة توعية جديدة لترشيد استهلاك الكهرباء خلال فصل الصيف',
   'وزارة الطاقة تطلق مبادرة بالتعاون مع بلديات عدة مناطق.',
   E'وزارة الطاقة تطلق مبادرة بالتعاون مع بلديات عدة مناطق.\n\nالحملة تشمل إرشادات عملية لتقليل الفاتورة الشهرية.',
   'https://picsum.photos/seed/ramyah-energy/600/450', 'published', now() - interval '7 hours');

insert into public.article_categories (article_id, category_id)
select a.id, c.id from public.articles a, public.categories c
where a.slug in (
  'baladiyat-beirut-tahil-bunya-tahtiya',
  'arsad-jawiya-tahzir-taqas',
  'maarid-kitab-sanawi',
  'hamla-tawiya-tarshid-kahraba'
) and c.slug = 'lebanon';

-- Sports section
insert into public.articles (slug, title, excerpt, content, image_url, status, published_at) values
  ('muntakhab-lubnani-fawz-widdiya', 'المنتخب اللبناني يفوز بمباراة ودية استعداداً للتصفيات المقبلة',
   'أداء قوي للاعبين في الشوط الثاني حسم نتيجة المباراة.',
   E'أداء قوي للاعبين في الشوط الثاني حسم نتيجة المباراة.\n\nالجهاز الفني يبدي ارتياحه لمستوى الفريق قبل التصفيات.',
   'https://picsum.photos/seed/ramyah-football/600/450', 'published', now() - interval '1 hour'),

  ('butulat-lubnan-kurat-salla', 'بطولة لبنان لكرة السلة تنطلق الأسبوع المقبل بمشاركة 12 نادياً',
   'تنظيم استثنائي وحضور جماهيري متوقع في الجولة الافتتاحية.',
   E'تنظيم استثنائي وحضور جماهيري متوقع في الجولة الافتتاحية.\n\nالاتحاد يعلن عن جدول المباريات الكامل للموسم.',
   'https://picsum.photos/seed/ramyah-basketball/600/450', 'published', now() - interval '3 hours'),

  ('laeb-lubnani-intiqal-nadi-urubi', 'لاعب لبناني ينضم إلى صفوف نادٍ أوروبي في صفقة انتقال جديدة',
   'الصفقة تأتي بعد موسم مميز حققه اللاعب مع فريقه المحلي.',
   E'الصفقة تأتي بعد موسم مميز حققه اللاعب مع فريقه المحلي.\n\nاللاعب يعرب عن سعادته بالانضمام إلى صفوف ناديه الجديد.',
   'https://picsum.photos/seed/ramyah-transfer/600/450', 'published', now() - interval '5 hours'),

  ('maratun-beirut-dawli', 'انطلاق ماراثون بيروت الدولي بمشاركة آلاف العدائين',
   'الفعالية السنوية تجذب مشاركين من أكثر من 30 دولة حول العالم.',
   E'الفعالية السنوية تجذب مشاركين من أكثر من 30 دولة حول العالم.\n\nإجراءات أمنية مشددة على طول مسار السباق.',
   'https://picsum.photos/seed/ramyah-marathon/600/450', 'published', now() - interval '8 hours');

insert into public.article_categories (article_id, category_id)
select a.id, c.id from public.articles a, public.categories c
where a.slug in (
  'muntakhab-lubnani-fawz-widdiya',
  'butulat-lubnan-kurat-salla',
  'laeb-lubnani-intiqal-nadi-urubi',
  'maratun-beirut-dawli'
) and c.slug = 'sports';

-- A few more per remaining category so every section has content
insert into public.articles (slug, title, excerpt, content, image_url, status, published_at) values
  ('qimma-dawliya-istiqrar-2', 'محادثات دبلوماسية لتهدئة التوتر بين عدة أطراف دولية',
   'لقاءات مكثفة على هامش الاجتماع السنوي للمنظمة الدولية.',
   E'لقاءات مكثفة على هامش الاجتماع السنوي للمنظمة الدولية.\n\nالمراقبون يترقبون بياناً ختامياً مشتركاً.',
   'https://picsum.photos/seed/ramyah-world-2/600/450', 'published', now() - interval '5 hours'),

  ('irtifa-asaar-taqa-alamiyan', 'ارتفاع أسعار الطاقة عالمياً وسط مخاوف من اضطراب الإمدادات',
   'محللون يتوقعون استمرار التقلبات خلال الأسابيع المقبلة.',
   E'محللون يتوقعون استمرار التقلبات خلال الأسابيع المقبلة.\n\nالأسواق العالمية تراقب عن كثب أي تطورات جديدة.',
   'https://picsum.photos/seed/ramyah-world-3/600/450', 'published', now() - interval '6 hours'),

  ('jalsa-tashriiya-mizaniya', 'جلسة تشريعية لمناقشة مشروع قانون الموازنة العامة',
   'نقاشات حادة متوقعة حول عدد من البنود الخلافية.',
   E'نقاشات حادة متوقعة حول عدد من البنود الخلافية.\n\nالجلسة تُعقد وسط حضور نيابي واسع.',
   'https://picsum.photos/seed/ramyah-pol-3/600/450', 'published', now() - interval '4 hours'),

  ('ziyara-rasmiya-wafd-diblomasi', 'زيارة رسمية لوفد دبلوماسي رفيع المستوى الأسبوع المقبل',
   'الزيارة تأتي في إطار تعزيز العلاقات الثنائية بين البلدين.',
   E'الزيارة تأتي في إطار تعزيز العلاقات الثنائية بين البلدين.\n\nبرنامج الزيارة يشمل لقاءات رسمية وشعبية.',
   'https://picsum.photos/seed/ramyah-pol-4/600/450', 'published', now() - interval '6 hours'),

  ('ghurfat-tijara-mubadara-shabab', 'غرفة التجارة والصناعة تطلق مبادرة لدعم المؤسسات الصغيرة',
   'المبادرة تشمل تسهيلات تمويلية واستشارات مجانية للشركات الناشئة.',
   E'المبادرة تشمل تسهيلات تمويلية واستشارات مجانية للشركات الناشئة.\n\nالتسجيل متاح إلكترونياً لجميع المهتمين.',
   'https://picsum.photos/seed/ramyah-eco-4/600/450', 'published', now() - interval '6 hours'),

  ('siyaha-numuw-mutawaqqa', 'توقعات بنمو القطاع السياحي خلال موسم الصيف المقبل',
   'حجوزات مبكرة تشير إلى إقبال لافت من السياح العرب والأجانب.',
   E'حجوزات مبكرة تشير إلى إقبال لافت من السياح العرب والأجانب.\n\nالفنادق تستعد لموسم استثنائي هذا العام.',
   'https://picsum.photos/seed/ramyah-eco-6/600/450', 'published', now() - interval '10 hours'),

  ('maarid-fanni-tashkili', 'معرض فني تشكيلي يجمع أعمال فنانين من أجيال مختلفة',
   'المعرض يستمر لعشرة أيام في إحدى الصالات الثقافية المعروفة.',
   E'المعرض يستمر لعشرة أيام في إحدى الصالات الثقافية المعروفة.\n\nتنوع لافت في الأساليب والمدارس الفنية المعروضة.',
   'https://picsum.photos/seed/ramyah-cul-4/600/450', 'published', now() - interval '7 hours'),

  ('musalsal-jadid-mutabaa', 'إطلاق مسلسل جديد يحظى بمتابعة واسعة منذ الحلقة الأولى',
   'العمل يتناول قصة اجتماعية أثارت نقاشاً واسعاً بين المشاهدين.',
   E'العمل يتناول قصة اجتماعية أثارت نقاشاً واسعاً بين المشاهدين.\n\nصناع العمل يعدون بمفاجآت في الحلقات المقبلة.',
   'https://picsum.photos/seed/ramyah-cul-5/600/450', 'published', now() - interval '9 hours'),

  ('mutamar-taqani-amn-sibirani', 'مؤتمر تقني يستعرض أحدث حلول الأمن السيبراني',
   'خبراء دوليون يشاركون تجاربهم في مواجهة الهجمات الإلكترونية.',
   E'خبراء دوليون يشاركون تجاربهم في مواجهة الهجمات الإلكترونية.\n\nجلسات تدريبية مصاحبة على مدى يومين.',
   'https://picsum.photos/seed/ramyah-tech-4/600/450', 'published', now() - interval '8 hours'),

  ('hadina-aamal-sharikat-nashia', 'حاضنة أعمال محلية تدعم عشر شركات ناشئة جديدة',
   'الدعم يشمل تمويلاً أولياً واستشارات فنية وتسويقية متخصصة.',
   E'الدعم يشمل تمويلاً أولياً واستشارات فنية وتسويقية متخصصة.\n\nالدفعة الجديدة تضم شركات في مجالات متنوعة.',
   'https://picsum.photos/seed/ramyah-tech-5/600/450', 'published', now() - interval '10 hours');

insert into public.article_categories (article_id, category_id)
select a.id, c.id from public.articles a, public.categories c
where (a.slug, c.slug) in (
  ('qimma-dawliya-istiqrar-2', 'world'),
  ('irtifa-asaar-taqa-alamiyan', 'world'),
  ('jalsa-tashriiya-mizaniya', 'politics'),
  ('ziyara-rasmiya-wafd-diblomasi', 'politics'),
  ('ghurfat-tijara-mubadara-shabab', 'economy'),
  ('siyaha-numuw-mutawaqqa', 'economy'),
  ('maarid-fanni-tashkili', 'culture'),
  ('musalsal-jadid-mutabaa', 'culture'),
  ('mutamar-taqani-amn-sibirani', 'tech'),
  ('hadina-aamal-sharikat-nashia', 'tech')
);
