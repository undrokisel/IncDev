import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import AuthHeader from "@components/Common/AuthHeader/AuthHeader";
import { Footer } from "@components/Common/Footer/Footer";
import { ProfileBreadcrumbs } from "@components/ProfileBreadcrumbs/ProfileBreadcrumbs";
import SideBar from "@components/SideBar/SideBar";

import arrowBtn from "assets/icons/arrows/arrowRight.svg";

import "./FrequentlyAskedQuestion.scss";

const faqs = [
  {
    id: 1,
    title: "Это фриланс-платформа?",
    ans: [
      `Нет, мы работаем только с юридическими лицами и индивидуальными предпринимателями и тщательно проверяем своих партнеров. Партнерами являются ИТ-компании, которые специализируются на оказании услуг в формате аутстафф-модели и обладают глубокой экспертизой в разработке и внедрении ИТ-проектов.`,
    ],
  },
  {
    id: 2,
    title: "Чем вы отличаетесь от традиционного процесса выбора исполнителя?",
    ans: [
      `Мы берем на себя заключение договоров с ИТ-партнерами, и вы будете иметь доступ к бОльшему количеству специалистов.
          Работа со специалистом проходит в формате аутстафф, т. е. вы напрямую взаимодействуете с выбранным специалистом ИТ-партнера, ставите ему задачи, контролируете процесс, получаете результат.
          `,
    ],
  },
  {
    id: 3,
    title: "Как начать работу?",
    ans: [
      `Зарегистрируйтесь с вашим рабочим адресом электронной почты, подпишите договор и начните оформлять заявки на бронирование времени специалистов.`,
    ],
  },
  {
    id: 4,
    title: "Как найти специлиста в компанию?",
    ans: [`Вы можете самостоятельно найти специалистов в открытом каталоге.`],
  },
  {
    id: 6,
    title: "Как организован процесс привлечения специалиста на проект?",
    ans: [`Процесс привлечения специалиста для выполнения работ на проект состоит из следующих этапов:`,
      `1. Найдите подходящего специалиста в каталоге`,
      `2. Оформите заявку для бронирования специалиста`,
      `3. Пройдите неходимые проверки (собеседование, знакомство с командой и пр.)`,
      `4. Подтвердите выбор специалиста и подпишите заявку на выбранный период`,
      `5. Начните работу со специлистом и получайте результат`,
      `Взаимодействие с выбранным специалистом для проведения необходимых проверок и вывода на проект организовывает менеджер платформы. Также вы можете обратиться к вашему персональному менеджеру для помощи на любом этапе.`
    ],
  },
  {
    id: 7,
    title: "Я недоволен работой привлеченного специалиста, что делать?",
    ans: [
      `Создайте жалобу на специалиста. Для этого:`,
      `Зайдите в Личный кабинет в раздел «Работающие специалисты».`,
      `Нажмите на специалиста и в меню на карточке выберите пункт «Пожаловаться».`,
      `В открывшейся форме выберите причину жалобы, введите описание и приложите подтверждающие материалы, если они есть, нажмите кнопку «Создать».`,
      `Созданная жалоба будет передана вашему персональному менеджеру. В процессе обработки жалобы менеджер будет связываться с вами, ИТ-партнером и специалистом, уточнять детали, запрашивать подтверждающие материалы, выяснять причины ситуации.`,
      `Решением по жалобе является набор следующих шагов, согласованный с клиентом и ИТ-партнером.`,
    ],
  },
];

export const FrequentlyAskedQuestion = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);

  useLayoutEffect(() => {
    const faq = faqs.filter((faq) => faq.id === +params.id)[0];
    setQuestion(faq);
  }, []);

  return (
    <div className="frequently-asked-question">
      <AuthHeader />
      <SideBar />
      <div className="frequently-asked-question__container container">
        <ProfileBreadcrumbs
          links={[
            { name: "Главная", link: "/auth" },
            {
              name: "FAQ (часто задаваемые вопросы)",
              link: "/frequently-asked-questions",
            },
            {
              name: question ? question.title : 'ошибка поиска страницы с вопросом',
              link: `/frequently-asked-question/${params.id}`,
            },
          ]}
        />
        <div className="frequently-asked-question__title">{question ? question.title : 'ошибка поиска страницы с вопросом'}</div>
        <div
          className="frequently-asked-question__back"
          onClick={() => navigate(-1)}
        >
          <div className="frequently-asked-question__arrow">
            <img src={arrowBtn}></img>
          </div>
          <p>вернуться к списку вопросов</p>
        </div>
        <div className="frequently-asked-question__answer">
          {question?.ans?.map((item, index) => (
            <><p key={index}>{item}</p><br /></>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
