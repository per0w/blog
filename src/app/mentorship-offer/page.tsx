import Link from "next/link";

import { getSiteHostname, PROFILE_EMAIL, SITE_ORIGIN } from "@/constants/common";

import type { Metadata } from "next";

const OFFER_URL = `${SITE_ORIGIN}/mentorship-offer`;
const siteHost = getSiteHostname();

export const metadata: Metadata = {
  title: "Публичная оферта — менторство | perovdev",
  description:
    "Условия оказания информационно-консультационных услуг (менторство): предмет, акцепт, оплата, ответственность, возврат.",
  openGraph: {
    title: "Публичная оферта на услуги менторства",
    description: `Публичная оферта на информационно-консультационные услуги (менторство) на ${siteHost}.`,
    type: "website",
    url: OFFER_URL,
  },
};

export default function MentorshipOfferPage() {
  return (
    <main
      aria-label="Публичная оферта на услуги менторства"
      className="mx-auto max-w-3xl px-5 py-12 md:py-16"
    >
      <article className="prose max-w-none prose-neutral dark:prose-invert">
        <p className="text-sm text-muted">
          <Link className="text-accent underline-offset-2 hover:underline" href="/#mentorship">
            ← К разделу «Менторство» на главной
          </Link>
        </p>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Публичный договор-оферта на оказание информационно-консультационных услуг (менторство)
        </h1>

        <div className="not-prose my-6 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-muted">
          <p className="font-medium text-foreground">Не путать с «наставничеством» по ТК РФ</p>
          <p className="mt-2">
            <a
              className="text-accent underline-offset-2 hover:underline"
              href="https://www.consultant.ru/document/cons_doc_LAW_34683/bd6d94a038b1f4918343ec0c601a0c04a702ee28/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Статья 351.8 ТК РФ
            </a>{" "}
            описывает наставничество как{" "}
            <strong className="text-foreground">поручение работодателя сотруднику</strong> помогать
            другому сотруднику на производстве — это трудовые отношения внутри организации.
            Настоящий договор —{" "}
            <strong className="text-foreground">возмездное оказание услуг</strong> по
            гражданско-правовому договору между Исполнителем и Заказчиком (физлицом или
            организацией), без замены трудового договора.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            С <strong className="text-foreground">1&nbsp;марта 2025&nbsp;года</strong> для
            работодателей отдельно закреплены правила{" "}
            <strong className="text-foreground">
              оплаты и оформления наставничества в сфере труда
            </strong>{" "}
            (трудовой договор или допсоглашение, приказ, размер доплаты, локальные акты, кадровый и
            расчётный учёт). Обзор для кадровиков и бухгалтерии — в материале{" "}
            <a
              className="text-accent underline-offset-2 hover:underline"
              href="https://taxcom.ru/baza-znaniy/kadrovaya-otchetnost/stati/kak-s-1-marta-2025-goda-oformlyat-i-oplachivat-nastavnichestvo/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Такском: как оформлять и оплачивать наставничество
            </a>
            . Эти правила относятся к{" "}
            <strong className="text-foreground">штатному наставнику</strong> по поручению
            работодателя, а не к оплате услуг Исполнителя по настоящей оферте: у
            Заказчика-организации внутреннее наставничество и договор с Исполнителем —{" "}
            <strong className="text-foreground">разные правовые режимы</strong>.
          </p>
          <p className="mt-2 text-xs text-muted">
            Структура оферты ориентирована на распространённую практику публичных оферт в сфере
            менторства; текст ниже адаптирован под индивидуальное оказание услуг Владимиром
            Перовым, а не скопирован.
          </p>
        </div>

        {/* ── 1. Общие положения ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">1. Общие положения</h2>
        <p className="text-sm leading-relaxed text-muted">
          1.1. Настоящий документ — публичная оферта в смысле п.&nbsp;2 ст.&nbsp;437 ГК РФ. Владимир
          Перов, именуемый <strong className="text-foreground">Исполнитель</strong>, публикует
          условия договора; физическое или юридическое лицо, совершившее акцепт, становится{" "}
          <strong className="text-foreground">Заказчиком</strong>.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          1.2. Текст оферты размещён в сети Интернет по адресу{" "}
          <a className="text-accent underline-offset-2 hover:underline" href={OFFER_URL}>
            {OFFER_URL}
          </a>
          .
        </p>
        <p className="text-sm leading-relaxed text-muted">
          1.3. В соответствии со ст.&nbsp;438 ГК РФ{" "}
          <strong className="text-foreground">акцептом</strong> оферты считается в первую очередь{" "}
          <strong className="text-foreground">оплата</strong> услуг на условиях, согласованных в
          переписке (счёт, сообщение о сумме и реквизитах), либо иное явное письменное согласие с
          условиями с последующей оплатой в согласованный срок.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          1.4. Совершая акцепт, Заказчик подтверждает, что условия договора ему понятны и не
          ущемляют его право на защиту в порядке, установленном законом.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          1.5. Акцептуя оферту, Заказчик — физическое лицо подтверждает, что является{" "}
          <strong className="text-foreground">полностью дееспособным</strong> (достигшим 18 лет)
          либо действует с согласия законного представителя. Представитель юридического лица
          подтверждает наличие полномочий на заключение договора.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          1.6. Связь с Исполнителем:{" "}
          <a
            className="text-accent underline-offset-2 hover:underline"
            href={`mailto:${PROFILE_EMAIL}`}
          >
            {PROFILE_EMAIL}
          </a>
          . Форма занятости Исполнителя (самозанятость, ИП и т.п.) и платёжные реквизиты сообщаются
          Заказчику до оплаты.
        </p>

        {/* ── 2. Предмет договора ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">2. Предмет договора</h2>
        <p className="text-sm leading-relaxed text-muted">
          2.1. Исполнитель оказывает Заказчику{" "}
          <strong className="text-foreground">информационно-консультационные услуги</strong> в
          области IT и смежных тем: менторские сессии, разбор кейсов, рекомендации по обучению и
          карьере, обсуждение кода и архитектуры, помощь в постановке задач. Конкретный состав,
          длительность и количество сессий фиксируются в переписке или счёте до оплаты.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          2.2. Услуги <strong className="text-foreground">не являются</strong>: медицинскими,
          психотерапевтическими, юридическими, бухгалтерскими; образовательной программой с выдачей
          государственного диплома; гарантией трудоустройства или дохода; посредничеством в
          заключении договоров Заказчика с третьими лицами.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          2.3. Рекомендации Исполнителя носят{" "}
          <strong className="text-foreground">исключительно информационный характер</strong> и
          предоставляются «как есть» (as&nbsp;is). Исполнитель не заявляет и не гарантирует их
          полноту, точность или пригодность для конкретных целей Заказчика. Решения на основе
          рекомендаций Заказчик принимает самостоятельно и на свой риск.
        </p>

        {/* ── 3. Стоимость и порядок расчётов ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">
          3. Стоимость и порядок расчётов
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          3.1. Цена, валюта и способ оплаты определяются индивидуально и указываются в переписке или
          счёте. По умолчанию применяется <strong className="text-foreground">предоплата</strong>{" "}
          согласованного объёма, если стороны не договорились об ином.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          3.2. Моментом оплаты считается поступление денежных средств на счёт / по реквизитам
          Исполнителя либо подтверждение платёжной системой — в зависимости от согласованного
          способа.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          3.3. Исполнитель вправе приостановить оказание услуг при неоплате согласованного этапа до
          устранения задолженности.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          3.4. Заказчик несёт риск ошибочного указания реквизитов при переводе.
        </p>

        {/* ── 4. Ответственность сторон ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">4. Ответственность сторон</h2>
        <p className="text-sm leading-relaxed text-muted">
          4.1. Исполнитель обязуется оказывать услуги добросовестно и в согласованные сроки (время
          созвонов, ответы в согласованных каналах).
        </p>
        <p className="text-sm leading-relaxed text-muted">
          4.2. Стороны освобождаются от ответственности за неисполнение или ненадлежащее исполнение
          обязательств вследствие <strong className="text-foreground">обстоятельств непреодолимой
          силы</strong> (форс-мажор): стихийные бедствия, военные действия, санкции, масштабные сбои
          инфраструктуры связи и электроснабжения, действия или акты государственных органов,
          делающие исполнение невозможным. Сторона, для которой наступили такие обстоятельства,
          уведомляет другую сторону в разумный срок и предлагает перенос.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          4.3. Исполнитель <strong className="text-foreground">не несёт ответственности</strong> за
          работу третьих лиц: провайдеров связи, операторов, платёжных систем, платформ видеосвязи.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          4.4. Исполнитель <strong className="text-foreground">не отвечает</strong> за то, каким
          образом Заказчик использует полученные в ходе консультаций сведения и за результаты такого
          использования (включая решения о трудоустройстве, выборе стека, сделках с третьими
          лицами, инвестициях в обучение).
        </p>
        <p className="text-sm leading-relaxed text-muted">
          4.5. Исполнитель <strong className="text-foreground">не гарантирует</strong> достижение
          Заказчиком какого-либо конкретного результата (оффер, экзамен, выручка, повышение и т.д.).
          Услуга является <strong className="text-foreground">процессной</strong>: обязательство
          Исполнителя — провести консультации в согласованном объёме с надлежащим качеством, а не
          обеспечить определённый итог.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          4.6.{" "}
          <strong className="text-foreground">
            Совокупная ответственность Исполнителя по настоящему договору
          </strong>{" "}
          по любому иску или претензии ограничивается суммой платежа, фактически уплаченной
          Заказчиком Исполнителю{" "}
          <strong className="text-foreground">по этому конкретному заказу</strong>. Исполнитель не
          отвечает за упущенную выгоду и иные косвенные убытки, если иное не предусмотрено
          императивными нормами закона.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          4.7. За ненадлежащее исполнение обязательств стороны несут ответственность в пределах,
          установленных ГК РФ и настоящей офертой.
        </p>

        {/* ── 5. Порядок оказания услуг и перенос ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">
          5. Порядок оказания услуг и перенос
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          5.1. Перенос согласованной сессии возможен при уведомлении Исполнителя не позднее чем за{" "}
          <strong className="text-foreground">24 часа</strong> до начала, если в переписке не
          установлен иной срок.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          5.2. Сессии, не состоявшиеся по вине Исполнителя, переносятся на согласованное время без
          потери для Заказчика.
        </p>

        {/* ── 6. Конфиденциальность и запись сессий ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">
          6. Конфиденциальность и запись сессий
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          6.1. Стороны не разглашают конфиденциальные сведения, полученные при исполнении договора,
          за исключением случаев, предусмотренных законом, и если информация стала общеизвестной не
          по вине получившей стороны.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          6.2. Запись сессий (аудио, видео, демонстрация экрана) допускается{" "}
          <strong className="text-foreground">только по взаимному согласию</strong> сторон.
          Несогласованная запись и (или) публичное распространение записей является нарушением
          конфиденциальности по п.&nbsp;6.1.
        </p>

        {/* ── 7. Персональные данные ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">7. Персональные данные</h2>
        <p className="text-sm leading-relaxed text-muted">
          7.1. Совершая акцепт, Заказчик даёт согласие на обработку своих персональных данных
          (ФИО, контактные данные, платёжные реквизиты) в целях исполнения настоящего договора —
          в объёме и на срок, необходимые для оказания услуг и исполнения обязательств по
          законодательству РФ.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          7.2. Исполнитель не передаёт персональные данные третьим лицам, кроме случаев,
          предусмотренных законодательством РФ. Обработка осуществляется в соответствии с
          Федеральным законом от 27.07.2006 №&nbsp;152-ФЗ «О персональных данных».
        </p>
        <p className="text-sm leading-relaxed text-muted">
          7.3. Заказчик вправе отозвать согласие на обработку персональных данных, направив
          письменное уведомление на {PROFILE_EMAIL}. Отзыв не затрагивает законность обработки,
          произведённой до его получения, и не освобождает от исполнения договорных обязательств.
        </p>

        {/* ── 8. Интеллектуальная собственность ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">
          8. Интеллектуальная собственность
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          8.1. Материалы, созданные Исполнителем в ходе оказания услуг (примеры кода, шаблоны,
          схемы, текстовые рекомендации), предоставляются Заказчику для{" "}
          <strong className="text-foreground">личного использования</strong>. Исключительные права
          на такие материалы сохраняются за Исполнителем, если иное не согласовано письменно.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          8.2. Заказчик не вправе распространять, перепродавать или публиковать материалы
          Исполнителя без его предварительного письменного согласия.
        </p>

        {/* ── 9. Возврат денежных средств ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">9. Возврат денежных средств</h2>
        <p className="text-sm leading-relaxed text-muted">
          9.1. Запросы о возврате направляются Исполнителю{" "}
          <strong className="text-foreground">письменно</strong> на {PROFILE_EMAIL} с указанием
          основания и реквизитов для возврата (если применимо).
        </p>
        <p className="text-sm leading-relaxed text-muted">
          9.2. Заказчик — физическое лицо вправе отказаться от исполнения договора в любое время в
          соответствии со <strong className="text-foreground">ст.&nbsp;32 Закона РФ «О защите прав
          потребителей»</strong>; в таком случае Исполнитель возвращает оплату за вычетом стоимости
          фактически оказанных услуг и документально подтверждённых расходов.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          9.3. Для Заказчиков — юридических лиц возврат за неиспользованную часть предоплаты
          (неоказанные сессии) возможен пропорционально при отказе от исполнения до фактического
          оказания соответствующих услуг — в порядке и сроки, согласованные в переписке.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          9.4. Удержание комиссий банка или платёжной системы может производиться в соответствии
          с их правилами. При отсутствии отдельной договорённости спорные вопросы возврата
          разрешаются с учётом фактического исполнения и принципа добросовестности.
        </p>

        {/* ── 10. Срок действия и расторжение ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">
          10. Срок действия договора и расторжение
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          10.1. Договор вступает в силу с момента акцепта и действует до полного исполнения
          обязательств по оплаченному объёму услуг.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          10.2. Досрочное расторжение по соглашению сторон или по основаниям, предусмотренным
          законом, оформляется письменно (в том числе электронной почтой).
        </p>

        {/* ── 11. Претензии и споры ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">11. Претензии и споры</h2>
        <p className="text-sm leading-relaxed text-muted">
          11.1. Стороны стремятся урегулировать споры переговорами.{" "}
          <strong className="text-foreground">Претензионный порядок обязателен:</strong> претензия
          направляется на {PROFILE_EMAIL}; срок ответа — до{" "}
          <strong className="text-foreground">15 календарных дней</strong> с даты получения, если
          законом или соглашением не установлен иной срок.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          11.2. При недостижении согласия спор подлежит рассмотрению в суде в соответствии с
          законодательством РФ. Для Заказчика — физического лица подсудность определяется{" "}
          <strong className="text-foreground">по правилам ст.&nbsp;17 Закона РФ «О защите прав
          потребителей»</strong> (по выбору потребителя).
        </p>

        {/* ── 12. Заключительные положения ── */}

        <h2 className="mt-10 text-lg font-semibold text-foreground">
          12. Заключительные положения
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          12.1. Исполнитель вправе обновлять текст оферты; для уже оплаченных услуг применяется
          редакция на дату акцепта, если иное не согласовано.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          12.2. В части, не урегулированной настоящей офертой, к отношениям с Заказчиком —
          физическим лицом применяется{" "}
          <strong className="text-foreground">
            Закон РФ «О защите прав потребителей»
          </strong>
          . Положения оферты, противоречащие императивным нормам указанного закона, применяются
          в редакции закона.
        </p>
        <p className="text-sm leading-relaxed text-muted">
          12.3. Вопросы, не урегулированные офертой и Законом о защите прав потребителей,
          разрешаются по законодательству Российской Федерации.
        </p>

        <div className="not-prose mt-10 rounded-xl border border-border bg-surface p-4 text-sm text-muted">
          <p className="font-medium text-foreground">Важно</p>
          <p className="mt-2 leading-relaxed">
            Текст не заменяет индивидуальную юридическую консультацию. Для ИП, самозанятости, B2B и
            крупных сумм разумно согласовать финальную редакцию с юристом и бухгалтером.
          </p>
        </div>
      </article>
    </main>
  );
}
