import Label from "../../components/label";
import { useRouter } from "next-nprogress-bar";
import useData from "../../hooks/use-data";

const Button = ({ children, onClick }: any) => {
  return (
    <Label
      className="w-[50px] h-[50px] text-[10px] font-semibold mt-[10px]"
      contentClassName="!rounded-[10px]  flex flex-col items-center justify-center"
      shadowClassName="!rounded-[10px]"
      hasPoints={false}
      onClick={onClick}
    >
      {children}
    </Label>
  );
};

export default function Actions() {
  const router = useRouter();
  const { historyRounds, nextRound } = useData();
  return (
    <div className="fixed right-[18px] bottom-[70px] z-[10]">
      {!!historyRounds.length && (
        <Button
          onClick={() => {
            router.push("/meme/bros/history");
          }}
        >
          {historyIcon}
          <span>History</span>
        </Button>
      )}
      {nextRound?.vote_status === "ongoing" && (
        <Button
          onClick={() => {
            router.push("/meme/bros/vote");
          }}
        >
          {voteIcon}
          <span>Vote</span>
        </Button>
      )}
    </div>
  );
}

const historyIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <g clip-path="url(#clip0_26190_23936)">
      <path
        d="M16.7619 9.42872H17.8095V10.4763H16.7619V9.42872ZM9.42855 5.23828H10.4761V6.28586H9.42855V5.23828ZM13.619 7.33346H14.6666V8.38112H13.619V7.33346ZM15.7143 6.28588H16.7619V7.33346H15.7143V6.28588ZM15.7143 5.23828H16.7619V6.28588H15.7143V5.23828ZM16.7619 7.33346H17.8095V8.38112H16.7619L16.7619 7.33346ZM16.7619 6.28588H17.8095V7.33346H16.7619L16.7619 6.28588ZM14.6666 6.28588H15.7143V7.33346H14.6666V6.28588ZM16.7619 5.23828H17.8095V6.28588L16.7619 6.28586L16.7619 5.23828ZM11.5237 6.28586H12.5714V7.33346H11.5237V6.28586ZM12.5714 6.28586H13.619V7.33346H12.5714V6.28586ZM13.619 6.28586L14.6666 6.28588V7.33346H13.619L13.619 6.28586ZM9.42855 6.28586H10.4761V7.33346H9.42855V6.28586ZM10.4761 6.28586H11.5237V7.33346H10.4761L10.4761 6.28586ZM8.38097 6.28586H9.42855V7.33346H8.38097V6.28586ZM7.33328 6.28586H8.38095V7.33346H7.33328V6.28586ZM11.5238 9.42872H12.5715V10.4763H11.5238V9.42872ZM15.7143 8.38114H16.7619V9.42872H15.7143V8.38114ZM16.7619 8.38114H17.8095L17.8095 9.42872H16.7619V8.38114ZM14.6666 8.38114H15.7143V9.42872H14.6666V8.38114ZM11.5238 8.38114H12.5715V9.42872H11.5238V8.38114ZM12.5715 8.38114H13.619V9.42872H12.5715V8.38114ZM10.4762 8.38114H11.5238V9.42872H10.4762V8.38114ZM13.6191 8.38114H14.6666V9.42872H13.6191V8.38114ZM8.38099 8.38114H9.42859V9.42872H8.38101L8.38099 8.38114ZM9.42859 8.38114H10.4762V9.42872H9.42859V8.38114ZM7.33333 8.38114H8.38099V9.42872H7.33333V8.38114ZM13.6191 11.5239H14.6666V12.5716H13.6191V11.5239ZM10.4762 11.5239H11.5238V12.5716H10.4762V11.5239ZM16.7619 11.5239H17.8095V12.5716H16.7619L16.7619 11.5239ZM16.7619 10.4763H17.8095V11.5239H16.7619L16.7619 10.4763ZM15.7143 10.4763H16.7619L16.7619 11.5239H15.7143V10.4763ZM13.6191 10.4763H14.6666V11.5239H13.6191V10.4763ZM14.6666 10.4763H15.7143V11.5239H14.6666V10.4763ZM12.5715 10.4763H13.619V11.5239H12.5715V10.4763ZM11.5238 10.4763H12.5715V11.5239H11.5238V10.4763ZM10.4762 10.4763H11.5238V11.5239H10.4762V10.4763ZM8.38099 10.4763H9.42859V11.5239H8.38101L8.38099 10.4763ZM9.42859 10.4763H10.4762V11.5239H9.42859V10.4763ZM7.33333 10.4763H8.38099V11.5239H7.33333V10.4763ZM14.6666 13.6192H15.7143V14.6668H14.6666V13.6192ZM13.6191 13.6192H14.6666V14.6668H13.6191V13.6192ZM15.7143 12.5716H16.7619L16.7619 13.6192L15.7143 13.6192V12.5716ZM14.6666 12.5716H15.7143V13.6192H14.6666V12.5716ZM13.6191 12.5716H14.6666V13.6192H13.6191V12.5716ZM12.5715 12.5716H13.619V13.6192H12.5715V12.5716ZM10.4762 12.5716H11.5238V13.6192H10.4762V12.5716ZM11.5238 12.5716H12.5715V13.6192H11.5238V12.5716ZM8.38099 12.5716H9.42859V13.6192H8.38101L8.38099 12.5716ZM9.42859 12.5716H10.4762V13.6192H9.42859V12.5716ZM7.33333 12.5716H8.38099V13.6192H7.33333V12.5716ZM12.5714 14.6668H13.6191V15.7144H12.5715L12.5714 14.6668ZM10.4762 14.6668H11.5238V15.7144H10.4762V14.6668ZM11.5238 14.6668H12.5714L12.5715 15.7144H11.5238V14.6668ZM9.42861 14.6668H10.4762V15.7144H9.42861V14.6668ZM8.38099 14.6668H9.42859V15.7144H8.38101L8.38099 14.6668ZM7.33333 14.6668H8.38099V15.7144H7.33333V14.6668ZM12.5714 13.6192H13.6191V14.6668H12.5714V13.6192ZM11.5238 13.6192L12.5715 13.6192L12.5714 14.6668H11.5238L11.5238 13.6192Z"
        fill="#E9D5AA"
      />
      <path
        d="M10.4762 13.6192H11.5237V14.6668H10.4762V13.6192ZM8.38096 13.6192H9.42856V14.6668H8.38098L8.38096 13.6192ZM9.42856 13.6192H10.4761V14.6668H9.42856V13.6192ZM7.3333 13.6192H8.38096L8.38098 14.6668H7.3333V13.6192ZM15.7143 11.5239H16.7619V12.5716H15.7143V11.5239ZM14.6666 11.5239H15.7143V12.5716H14.6666V11.5239ZM11.5238 11.5239H12.5714V12.5716H11.5238V11.5239ZM12.5714 11.5239H13.619V12.5716H12.5714V11.5239ZM7.33332 11.5239H8.38096V12.5716H7.3333L7.33332 11.5239ZM8.38096 11.5239H9.42856V12.5716H8.38096V11.5239ZM9.42856 11.5239H10.4761V12.5716H9.42856V11.5239ZM15.7143 9.42872H16.7619V10.4763H15.7143V9.42872ZM14.6666 9.42872H15.7143V10.4763H14.6666V9.42872ZM13.619 9.42872H14.6666V10.4763H13.619V9.42872ZM12.5714 9.42872H13.619V10.4763H12.5714V9.42872ZM10.4762 9.42872H11.5237V10.4763H10.4762V9.42872ZM9.42858 9.42872H10.4762V10.4763H9.42858V9.42872ZM8.38096 9.42872H9.42856V10.4763H8.38098L8.38096 9.42872ZM7.3333 9.42872H8.38096L8.38098 10.4763H7.3333V9.42872ZM15.7143 7.33346H16.7619V8.38112H15.7143V7.33346ZM14.6666 7.33346H15.7143V8.38112H14.6666V7.33346ZM12.5714 7.33346H13.619V8.38112H12.5714V7.33346ZM11.5238 7.33346H12.5714V8.38112H11.5238V7.33346ZM8.38096 7.33346H9.42856V8.38112H8.38098L8.38096 7.33346ZM10.4762 7.33346H11.5237V8.38112H10.4762V7.33346ZM9.42858 7.33346H10.4762V8.38112H9.42858V7.33346ZM7.3333 7.33346H8.38096L8.38098 8.38112H7.3333V7.33346ZM14.6666 5.23828H15.7143V6.28586H14.6666V5.23828ZM11.5238 5.23828H12.5714V6.28586H11.5238V5.23828ZM12.5714 5.23828H13.619V6.28586H12.5714V5.23828ZM13.619 5.23828H14.6666V6.28586H13.619V5.23828ZM10.4762 5.23828H11.5237V6.28586H10.4762V5.23828ZM8.38096 5.23828H9.42856V6.28586H8.38098L8.38096 5.23828ZM7.3333 5.23828H8.38096L8.38098 6.28586H7.3333V5.23828Z"
        fill="#68748A"
      />
      <path
        d="M14.6666 15.7137H15.7143V16.7613H14.6666V15.7137ZM13.619 15.7137H14.6666V16.7613H13.619V15.7137ZM14.6666 14.666H15.7143V15.7137H14.6666V14.666ZM13.619 14.666H14.6666V15.7137H13.619V14.666Z"
        fill="#E33A43"
      />
      <path
        d="M15.7143 16.7624H16.7619V17.81H15.7143V16.7624ZM13.619 16.7624H14.6666V17.81H13.619V16.7624ZM14.6666 16.7624H15.7143V17.81H14.6666V16.7624ZM12.5714 16.7624H13.619V17.81H12.5714V16.7624ZM10.4762 16.7624H11.5237V17.81H10.4762V16.7624ZM11.5237 16.7624H12.5714V17.81H11.5238L11.5237 16.7624ZM7.3333 16.7624H8.38096V17.81H7.3333V16.7624ZM8.38096 16.7624H9.42856V17.81H8.38096V16.7624ZM9.42856 16.7624H10.4761V17.81H9.42856V16.7624ZM10.4761 15.7148H11.5238V16.7624L10.4762 16.7624L10.4761 15.7148ZM11.5238 15.7148H12.5714V16.7624L11.5238 16.7624V15.7148ZM12.5714 15.7148H13.619V16.7624L12.5714 16.7624V15.7148ZM9.42856 15.7148H10.4761V16.7624H9.42856V15.7148ZM8.38098 15.7148H9.42856V16.7624L8.38098 16.7624V15.7148ZM7.3333 15.7148H8.38098L8.38096 16.7624H7.3333V15.7148ZM6.28572 17.81H7.3333V18.8577H6.28572V17.81Z"
        fill="#E9D5AA"
      />
      <path
        d="M6.28571 15.7135H7.33331V16.761H6.28573L6.28571 15.7135ZM5.23813 9.42773H6.28571V10.4753H5.23813V9.42773Z"
        fill="white"
      />
      <path
        d="M6.28571 9.42844H7.3333V10.476H6.28573L6.28571 9.42844ZM6.28571 8.38086H7.3333V9.42844H6.28571V8.38086Z"
        fill="#E9D5AA"
      />
      <path
        d="M6.28571 14.666H7.3333V15.7137H6.28573L6.28571 14.666Z"
        fill="white"
      />
      <path
        d="M6.28571 13.6192H7.33331V14.6668H6.28573L6.28571 13.6192ZM6.28571 5.23828H7.33331V6.28586H6.28573L6.28571 5.23828ZM6.28571 11.5239H7.33331V12.5716H6.28573L6.28571 11.5239ZM6.28571 10.4763H7.33331V11.5239H6.28573L6.28571 10.4763ZM6.28573 6.28586H7.33331V7.33346H6.28573V6.28586ZM5.23813 12.5716H6.28573L6.28571 13.6192L5.23813 13.6192V12.5716ZM5.23813 6.28586H6.28573V7.33346H5.23813V6.28586ZM5.23813 5.23828H6.28571L6.28573 6.28586H5.23813V5.23828ZM6.28573 7.33346H7.33331V8.38112H6.28573V7.33346ZM5.23813 7.33346H6.28573V8.38112H5.23813V7.33346Z"
        fill="#E9D5AA"
      />
      <path
        d="M5.2381 13.6191H6.2857V14.6667H5.23812L5.2381 13.6191Z"
        fill="white"
      />
      <path
        d="M5.2381 8.38086H6.2857V9.42846H5.23812L5.2381 8.38086ZM6.2857 12.5713H7.3333V13.6189H6.28572L6.2857 12.5713ZM6.2857 16.7618H7.3333V17.8094H6.28572L6.2857 16.7618Z"
        fill="#E9D5AA"
      />
      <path
        d="M5.2381 11.5242H6.2857V12.5718H5.23812L5.2381 11.5242ZM5.2381 10.4766H6.2857V11.5241H5.23812L5.2381 10.4766ZM5.2381 14.667H6.2857V15.7147H5.23812L5.2381 14.667Z"
        fill="white"
      />
      <path
        d="M4.19044 18.857H5.23813V19.9046H4.19044V18.857ZM5.23813 18.857H6.28571V19.9046H5.23813V18.857ZM5.23813 16.7618H6.28571V17.8094H5.23813V16.7618ZM5.23813 17.8094H6.28571V18.857H5.23813V17.8094ZM4.19044 12.5713H5.23813V13.6189H4.19044V12.5713ZM4.19044 8.38086H5.23813V9.42846H4.19044V8.38086ZM4.19044 11.5237H5.23813V12.5713H4.19044V11.5237ZM4.19044 14.6665H5.23813V15.7142H4.19044V14.6665Z"
        fill="#E9D5AA"
      />
      <path
        d="M4.19044 9.42773H5.23813V10.4753H4.19044V9.42773Z"
        fill="white"
      />
      <path
        d="M4.19044 7.33374H5.23813V8.38141H4.19044V7.33374ZM5.23813 15.7147H6.28571V16.7623H5.23813V15.7147ZM4.19044 15.7147H5.23813V16.7623H4.19044V15.7147ZM4.19044 16.7623H5.23813V17.8099H4.19044V16.7623ZM4.19044 6.28614H5.23813V7.33374H4.19044V6.28614ZM4.19044 17.8099H5.23813V18.8576H4.19044V17.8099ZM4.19044 10.4766H5.23813V11.5242H4.19044V10.4766ZM4.19044 13.6195H5.23813V14.667H4.19044V13.6195ZM4.19044 5.23857H5.23813V6.28614H4.19044V5.23857ZM16.7619 14.667H17.8095V15.7147H16.7619L16.7619 14.667ZM17.8095 4.19088H18.8572V5.23857H17.8095L17.8095 4.19088ZM17.8095 3.1433H18.8572V4.19088H17.8095V3.1433ZM17.8095 5.23857H18.8572V6.28614H17.8095V5.23857ZM16.7619 15.7147H17.8095V16.7623H16.7619V15.7147ZM16.7619 13.6195H17.8095V14.667H16.7619L16.7619 13.6195ZM16.7619 16.7623H17.8095V17.8099H16.7619V16.7623ZM16.7619 12.5719H17.8095V13.6195H16.7619V12.5719ZM17.8095 6.28614H18.8572V7.33374H17.8095V6.28614ZM15.7143 3.1433H16.7619V4.19088H15.7143V3.1433ZM14.6666 2.0957H15.7143V3.1433L14.6666 3.14328V2.0957ZM15.7143 4.19088H16.7619V5.23857H15.7143V4.19088Z"
        fill="#E9D5AA"
      />
      <path
        d="M15.7143 2.0957H16.7619V3.14328H15.7143V2.0957ZM16.7619 3.14328H17.8095V4.19088H16.7619L16.7619 3.14328ZM15.7143 13.6195H16.7619V14.667H15.7143V13.6195ZM15.7143 15.7147H16.7619V16.7623H15.7143V15.7147Z"
        fill="#E9D5AA"
      />
      <path
        d="M16.7619 4.19141H17.8095V5.23909H16.7619V4.19141Z"
        fill="white"
      />
      <path
        d="M15.7143 14.667H16.7619V15.7147H15.7143V14.667ZM16.7619 2.0957H17.8095V3.14328H16.7619L16.7619 2.0957ZM14.6666 3.14328H15.7143V4.19088H14.6666V3.14328ZM14.6666 4.19088H15.7143V5.23857H14.6666V4.19088ZM12.5714 4.19088H13.619V5.23857H12.5714V4.19088ZM11.5238 2.0957H12.5714V3.14328H11.5238V2.0957ZM13.619 4.19088H14.6666V5.23857H13.619V4.19088ZM13.619 2.0957H14.6666V3.14328H13.619V2.0957Z"
        fill="#E9D5AA"
      />
      <path
        d="M11.5238 3.1433H12.5714V4.19088H11.5238V3.1433ZM11.5238 4.19088H12.5714V5.23857H11.5238V4.19088ZM12.5714 3.1433H13.619V4.19088H12.5714V3.1433ZM12.5714 2.0957H13.619V3.1433H12.5714V2.0957ZM13.619 3.1433L14.6666 3.14328V4.19088H13.619V3.1433ZM9.42857 4.19088H10.4762V5.23857H9.42857V4.19088ZM10.4762 4.19088H11.5238V5.23857H10.4762L10.4762 4.19088ZM10.4762 3.1433H11.5238V4.19088H10.4762L10.4762 3.1433Z"
        fill="#E9D5AA"
      />
      <path
        d="M10.4762 2.0957H11.5237V3.14328H10.4762V2.0957ZM9.42859 3.14328H10.4762V4.19088H9.42859V3.14328ZM8.38097 2.0957H9.42857V3.14328H8.38099L8.38097 2.0957Z"
        fill="#E9D5AA"
      />
      <path
        d="M8.38097 3.1433H9.42857V4.19088H8.38099L8.38097 3.1433ZM9.42857 2.0957H10.4761V3.14328L9.42857 3.1433V2.0957ZM8.38099 4.19088H9.42857V5.23857H8.38099V4.19088ZM6.28571 3.1433H7.33331V4.19088H6.28573L6.28571 3.1433ZM6.28573 4.19088H7.33331V5.23857H6.28573V4.19088ZM5.23813 4.19088H6.28573V5.23857H5.23813V4.19088ZM7.33331 2.0957H8.38097V3.1433H7.33331V2.0957ZM5.23813 3.14328L6.28571 3.1433L6.28573 4.19088H5.23813V3.14328Z"
        fill="#E9D5AA"
      />
      <path
        d="M6.28571 2.0957H7.33331V3.14328H6.28573L6.28571 2.0957ZM5.23813 2.0957H6.28571L6.28573 3.14328H5.23813V2.0957ZM7.33331 4.19088H8.38097V5.23857H7.33331V4.19088ZM7.33331 3.14328L8.38097 3.1433V4.19088H7.33331V3.14328ZM3.14287 2.0957H4.19045V3.14328H3.14287V2.0957ZM4.19045 4.19088H5.23813V5.23857H4.19045V4.19088ZM4.19045 3.14328H5.23813V4.19088H4.19045V3.14328Z"
        fill="#E9D5AA"
      />
      <path d="M4.19044 2.0957H5.23813V3.14328H4.19044V2.0957Z" fill="white" />
      <path
        d="M17.8095 9.42923H18.8571V10.4768H17.8095V9.42923ZM17.8095 16.7625H18.8571V17.8101H17.8095V16.7625ZM17.8095 8.38163H18.8571V9.42923H17.8095V8.38163ZM17.8095 12.5721H18.8571V13.6197H17.8095V12.5721ZM17.8095 7.33398H18.8571V8.38163H17.8095V7.33398ZM17.8095 10.4768H18.8571V11.5244H17.8095V10.4768ZM17.8095 11.5244H18.8571V12.5721H17.8095V11.5244Z"
        fill="#E9D5AA"
      />
      <path
        d="M18.8571 19.9052H19.9047V20.9528H18.8572L18.8571 19.9052ZM7.3333 19.9052H8.38096V20.9528H7.3333V19.9052ZM16.7619 18.8576H17.8095V19.9052H16.7619L16.7619 18.8576ZM13.619 18.8576H14.6666V19.9052H13.619V18.8576ZM15.7143 18.8576H16.7619L16.7619 19.9052H15.7143V18.8576ZM14.6666 18.8576H15.7143V19.9052H14.6666V18.8576ZM11.5238 18.8576H12.5714V19.9052H11.5238V18.8576ZM10.4762 18.8576H11.5237V19.9052H10.4762V18.8576ZM12.5714 18.8576H13.619V19.9052H12.5714V18.8576ZM8.38096 18.8576H9.42856V19.9052H8.38096V18.8576ZM9.42856 18.8576H10.4762V19.9052H9.42856V18.8576ZM16.7619 19.9052H17.8095V20.9528H16.7619V19.9052ZM16.7619 17.8099H17.8095V18.8576H16.7619L16.7619 17.8099ZM15.7143 19.9052H16.7619V20.9528H15.7143V19.9052ZM13.619 19.9052H14.6666V20.9528H13.619V19.9052ZM14.6666 19.9052H15.7143V20.9528H14.6666V19.9052ZM14.6666 17.8099H15.7143V18.8576H14.6666V17.8099ZM15.7143 17.8099H16.7619L16.7619 18.8576H15.7143V17.8099ZM13.619 17.8099H14.6666V18.8576H13.619V17.8099ZM11.5238 17.8099H12.5714V18.8576H11.5238V17.8099ZM12.5714 17.8099H13.619V18.8576H12.5714V17.8099ZM12.5714 19.9052H13.619V20.9528H12.5714V19.9052ZM10.4762 17.8099H11.5237V18.8576H10.4762V17.8099ZM10.4762 19.9052H11.5237V20.9528H10.4762V19.9052ZM11.5237 19.9052H12.5714V20.9528H11.5238L11.5237 19.9052ZM8.38096 19.9052H9.42856V20.9528H8.38096V19.9052ZM8.38096 17.8099H9.42856V18.8576H8.38098L8.38096 17.8099ZM9.42856 17.8099H10.4762V18.8576H9.42856V17.8099ZM9.42856 19.9052H10.4762V20.9528H9.42856V19.9052ZM17.8095 18.8576H18.8571V19.9052H17.8095V18.8576ZM19.9047 18.8576H20.9523V19.9052H19.9047V18.8576ZM19.9047 17.8099H20.9523V18.8576H19.9047V17.8099ZM18.8572 17.8099H19.9047V18.8576H18.8572V17.8099ZM17.8095 17.8099H18.8571V18.8576H17.8095V17.8099ZM17.8095 19.9052H18.8571V20.9528H17.8095V19.9052ZM18.8571 18.8576H19.9047V19.9052H18.8572L18.8571 18.8576ZM7.3333 18.8576H8.38096V19.9052H7.3333V18.8576ZM7.3333 17.8099H8.38096L8.38098 18.8576H7.3333V17.8099ZM5.23812 19.9052H6.2857V20.9528H5.23812V19.9052ZM6.2857 19.9052H7.3333V20.9528H6.2857V19.9052ZM6.2857 18.8576H7.3333V19.9052H6.2857V18.8576ZM3.14286 4.19086H4.19043V5.23855H3.14286V4.19086ZM3.14286 3.14328H4.19043V4.19086H3.14286V3.14328ZM2.09526 2.0957H3.14283L3.14286 3.14328H2.09526V2.0957ZM2.09526 4.19088H3.14283V5.23857H2.09526V4.19088ZM2.09526 3.14328L3.14283 3.1433V4.19088H2.09526V3.14328ZM1.04759 4.19088H2.09526V5.23857H1.04759V4.19088ZM1.04759 3.1433L2.09526 3.14328V4.19088H1.04759V3.1433Z"
        fill="#E3A573"
      />
      <path
        d="M20.9523 18.8569H22V19.9045H20.9523V18.8569ZM20.9523 17.8092H22V18.8569H20.9523V17.8092ZM19.9047 19.9045H20.9523V20.952H19.9047V19.9045ZM19.9047 16.7616H20.9523V17.8092H19.9047V16.7616ZM18.8572 20.9521H19.9047V21.9997H18.8572V20.9521ZM18.8572 16.7616H19.9047V17.8092H18.8572V16.7616ZM18.8572 15.714H19.9047V16.7616H18.8572V15.714ZM18.8572 14.6663H19.9047V15.714H18.8572V14.6663ZM18.8572 13.6187H19.9047V14.6663H18.8572V13.6187ZM18.8572 12.5711H19.9047V13.6187H18.8572V12.5711ZM18.8572 11.5235H19.9047V12.5711H18.8572V11.5235ZM18.8572 10.4759H19.9047V11.5235H18.8572V10.4759ZM18.8572 9.42831H19.9047V10.4759H18.8572V9.42831ZM18.8572 8.38068H19.9047V9.42828H18.8572V8.38068ZM18.8572 7.33302H19.9047V8.38068H18.8572V7.33302ZM18.8572 6.28544H19.9047V7.33302H18.8572V6.28544ZM18.8572 5.23784H19.9047V6.28544H18.8572V5.23784ZM18.8572 4.19016H19.9047V5.23784H18.8572V4.19016ZM18.8572 3.14258H19.9047V4.19016H18.8572V3.14258ZM17.8095 20.9521H18.8571V21.9997H17.8095V20.9521Z"
        fill="black"
      />
      <path
        d="M17.8095 15.7148H18.8571V16.7624H17.8095V15.7148Z"
        fill="white"
      />
      <path
        d="M17.8095 14.6667H18.8571V15.7144H17.8095V14.6667ZM17.8095 13.6191H18.8571V14.6667H17.8095V13.6191Z"
        fill="#E9D5AA"
      />
      <path
        d="M17.8095 2.09456H18.8571V3.14214H17.8095V2.09456ZM16.7619 20.9516H17.8095V21.9993H16.7619V20.9516ZM16.7619 1.0469H17.8095V2.09456H16.7619V1.0469ZM15.7143 20.9516H16.7619L16.7619 21.9993H15.7143V20.9516ZM15.7143 1.0469H16.7619V2.09456H15.7143V1.0469ZM14.6666 20.9516H15.7143V21.9993H14.6666V20.9516ZM14.6666 1.0469H15.7143V2.09456H14.6666V1.0469ZM13.619 20.9516H14.6666V21.9993H13.619V20.9516ZM13.619 1.0469H14.6666V2.09456H13.619V1.0469ZM12.5714 20.9516H13.619V21.9993H12.5714V20.9516ZM12.5714 1.0469H13.619V2.09456H12.5714V1.0469ZM11.5238 20.9516H12.5714V21.9993H11.5238V20.9516ZM11.5238 1.0469H12.5714V2.09456H11.5238V1.0469ZM10.4762 20.9516H11.5237V21.9993H10.4762V20.9516ZM10.4762 1.0469H11.5237V2.09456H10.4762V1.0469ZM9.42859 20.9516H10.4762V21.9993H9.42859V20.9516ZM9.42859 1.0469H10.4762V2.09456H9.42859V1.0469ZM8.38097 20.9516H9.42857V21.9993H8.38099L8.38097 20.9516ZM8.38097 1.0469H9.42857V2.09456H8.38099L8.38097 1.0469ZM7.33331 20.9516H8.38097L8.38099 21.9993H7.33331V20.9516ZM7.33331 1.0469H8.38097L8.38099 2.09456H7.33331V1.0469ZM6.28573 20.9516H7.33331V21.9993H6.28573V20.9516ZM6.28573 1.0469H7.33331V2.09456H6.28573V1.0469ZM5.23811 20.9516H6.28568V21.9993H5.23811V20.9516ZM5.23811 1.0469H6.28568V2.09456H5.23811V1.0469ZM4.19042 19.904H5.23811V20.9516H4.19042V19.904ZM4.19042 1.0469H5.23811V2.09456H4.19042V1.0469ZM3.14284 18.8564H4.19042V19.904H3.14284V18.8564ZM3.14284 17.8088H4.19042V18.8564H3.14284V17.8088ZM3.14284 16.7612H4.19042V17.8088H3.14284V16.7612ZM3.14284 15.7136H4.19042V16.7612H3.14284V15.7136ZM3.14284 14.6659H4.19042V15.7136H3.14284V14.6659ZM3.14284 13.6183H4.19042V14.6659H3.14284V13.6183ZM3.14284 12.5707H4.19042V13.6183H3.14284V12.5707ZM3.14284 11.5231H4.19042V12.5707H3.14284V11.5231ZM3.14284 10.4755H4.19042V11.523H3.14284V10.4755ZM3.14284 9.42789H4.19042V10.4755H3.14284V9.42789ZM3.14284 8.38027H4.19042V9.42787H3.14284V8.38027ZM3.14284 7.3326H4.19042V8.38027H3.14284V7.3326ZM3.14284 6.28502H4.19042V7.3326H3.14284V6.28502ZM3.14284 5.23742H4.19042V6.28502H3.14284V5.23742ZM3.14284 1.0469H4.19042V2.09456H3.14284V1.0469ZM2.09526 5.2374H3.14284V6.28502L2.09526 6.285V5.2374ZM2.09526 1.04688H3.14284V2.09456H2.09526V1.04688ZM1.0476 5.2374H2.09526V6.285H1.0476V5.2374ZM1.0476 2.09456H2.09526V3.14214H1.0476V2.09456ZM0 4.18974H1.04758V5.23742H0V4.18974ZM0 3.14216H1.04758V4.18974H0V3.14216Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_26190_23936">
        <rect width="22" height="22" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const voteIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
  >
    <path d="M12.5714 18.8574H13.619V19.905H12.5714V18.8574Z" fill="#C0C8D5" />
    <path d="M13.619 18.8574H14.6666V19.905H13.619V18.8574Z" fill="white" />
    <path
      d="M9.42857 18.8574H10.4762V19.905H9.42857V18.8574ZM11.5238 18.8574H12.5714V19.905H11.5238V18.8574ZM10.4762 18.8574H11.5238V19.905H10.4762V18.8574Z"
      fill="#C0C8D5"
    />
    <path d="M7.3333 18.8574H8.38096V19.905H7.3333V18.8574Z" fill="#939299" />
    <path
      d="M8.38097 18.8574H9.42857V19.905H8.38099L8.38097 18.8574Z"
      fill="#4C4F65"
    />
    <path
      d="M6.28571 18.8574H7.3333V19.905H6.28573L6.28571 18.8574Z"
      fill="#939299"
    />
    <path d="M13.619 16.7617H14.6666V17.8093H13.619V16.7617Z" fill="#C0C8D5" />
    <path d="M12.5714 16.7617H13.619V17.8093H12.5714V16.7617Z" fill="white" />
    <path
      d="M10.4762 16.7617H11.5237V17.8093H10.4762V16.7617ZM11.5237 16.7617H12.5714V17.8093H11.5238L11.5237 16.7617ZM9.42859 16.7617H10.4762V17.8093H9.42859V16.7617Z"
      fill="#C0C8D5"
    />
    <path
      d="M6.28571 16.7617H7.3333V17.8093H6.28573L6.28571 16.7617ZM7.3333 16.7617H8.38097V17.8093H7.3333V16.7617Z"
      fill="#939299"
    />
    <path
      d="M8.38097 16.7624H9.42857V17.81H8.38099L8.38097 16.7624ZM12.5714 19.9053H13.619V20.9529H12.5714V19.9053ZM10.4762 19.9053H11.5237V20.9529H10.4762V19.9053ZM11.5237 19.9053H12.5714V20.9529H11.5238L11.5237 19.9053ZM9.42859 19.9053H10.4762V20.9529H9.42859V19.9053ZM8.38097 19.9053H9.42857V20.9529H8.38099L8.38097 19.9053ZM7.3333 19.9053H8.38097L8.38099 20.9529H7.3333V19.9053ZM13.619 17.81H14.6666V18.8577H13.619V17.81ZM12.5714 17.81H13.619V18.8577H12.5714V17.81ZM11.5238 17.81H12.5714V18.8577H11.5238V17.81ZM9.42857 17.81H10.4761V18.8577H9.42857V17.81ZM10.4761 17.81H11.5238V18.8577H10.4762L10.4761 17.81ZM7.3333 17.81H8.38099L8.38097 18.8577H7.3333V17.81ZM6.28573 17.81H7.3333V18.8577H6.28573V17.81ZM8.38099 17.81H9.42857V18.8577H8.38097L8.38099 17.81ZM12.5714 15.7148H13.619V16.7624H12.5714V15.7148ZM13.619 15.7148H14.6666V16.7624H13.619V15.7148ZM10.4762 15.7148H11.5237V16.7624H10.4762V15.7148ZM11.5237 15.7148H12.5714V16.7624H11.5238L11.5237 15.7148ZM9.42859 15.7148H10.4762V16.7624H9.42859V15.7148ZM6.28571 15.7148H7.3333V16.7624H6.28573L6.28571 15.7148ZM7.3333 15.7148H8.38097V16.7624L7.3333 16.7624V15.7148ZM8.38097 15.7148H9.42857V16.7624L8.38099 16.7624L8.38097 15.7148Z"
      fill="#4C4F65"
    />
    <path d="M12.5714 14.666H13.619V15.7137H12.5714V14.666Z" fill="white" />
    <path d="M13.619 14.666H14.6666V15.7137H13.619V14.666Z" fill="#C0C8D5" />
    <path d="M11.5238 14.666H12.5714V15.7137H11.5238V14.666Z" fill="white" />
    <path
      d="M10.4762 14.666H11.5237V15.7137H10.4762V14.666ZM9.42859 14.666H10.4762V15.7137H9.42859V14.666Z"
      fill="#C0C8D5"
    />
    <path
      d="M7.3333 14.666H8.38096V15.7137H7.3333V14.666ZM6.28572 14.666H7.3333V15.7137H6.28572V14.666Z"
      fill="#939299"
    />
    <path
      d="M8.38097 14.666H9.42857V15.7137H8.38099L8.38097 14.666Z"
      fill="#4C4F65"
    />
    <path
      d="M6.28571 12.5719H7.33331V13.6194H6.28573L6.28571 12.5719ZM10.4762 11.5242H11.5237V12.5719H10.4762V11.5242ZM10.4762 7.33374H11.5237V8.38141H10.4762V7.33374ZM12.5714 7.33374H13.619V8.38141H12.5714V7.33374ZM9.42857 8.38141H10.4761V9.42901H9.42857V8.38141ZM9.42857 7.33374H10.4761V8.38141H9.42857V7.33374ZM9.42857 6.28617H10.4761V7.33374H9.42857V6.28617ZM13.619 3.1433H14.6666V4.19088H13.619V3.1433ZM14.6666 5.23857H15.7143V6.28615H14.6666V5.23857ZM14.6666 4.19088H15.7143V5.23857H14.6666V4.19088ZM10.4762 4.19088H11.5237V5.23857H10.4762V4.19088ZM9.42859 2.0957H10.4762V3.14328H9.42859V2.0957ZM7.33331 11.5242H8.38097V12.5719H7.33331V11.5242ZM6.28573 9.42901H7.33331V10.4766H6.28573V9.42901ZM7.33331 9.42901H8.38097V10.4766H7.33331V9.42901ZM7.33331 10.4766H8.38097V11.5242H7.33331V10.4766ZM4.19044 7.33377H5.23813V8.38143H4.19044V7.33377ZM5.23813 7.33377H6.28571V8.38143H5.23813V7.33377ZM4.19044 6.28619H5.23813V7.33377H4.19044V6.28619ZM4.19044 5.23859H5.23813V6.28617H4.19044V5.23859ZM5.23813 5.23859H6.28571V6.28617H5.23813V5.23859ZM5.23813 8.38143H6.28571V9.42903H5.23813V8.38143ZM5.23813 6.28617H6.28571V7.33377H5.23813V6.28617Z"
      fill="#FEAD35"
    />
    <path
      d="M11.5238 5.23907H12.5714V6.28667H11.5238V5.23907ZM11.5238 4.19141H12.5714V5.23909H11.5238V4.19141ZM12.5714 5.23909H13.619V6.28667H12.5714V5.23909ZM13.619 6.28667H14.6666V7.33427H13.619L13.619 6.28667Z"
      fill="#F77621"
    />
    <path
      d="M13.619 4.19141H14.6666V5.23909H13.619V4.19141ZM13.619 5.23909H14.6666V6.28667H13.619V5.23909Z"
      fill="#FEAD35"
    />
    <path
      d="M12.5714 4.19016H13.619V5.23784H12.5714V4.19016ZM11.5238 3.14258H12.5714V4.19016H11.5238V3.14258ZM10.4762 3.14258H11.5237V4.19016H10.4762V3.14258ZM12.5714 3.14258H13.619V4.19016H12.5714V3.14258ZM12.5714 6.28542H13.619V7.33302H12.5714V6.28542ZM13.619 12.5711H14.6666V13.6187H13.619L13.619 12.5711ZM13.619 11.5235H14.6666V12.5711H13.619V11.5235Z"
      fill="#F77621"
    />
    <path d="M14.6666 10.4766H15.7143V11.5241H14.6666V10.4766Z" fill="white" />
    <path
      d="M15.7143 9.42773H16.7619V10.4753H15.7143V9.42773Z"
      fill="#F77621"
    />
    <path d="M14.6666 9.42773H15.7143V10.4753H14.6666V9.42773Z" fill="white" />
    <path
      d="M16.7619 8.38193H17.8095V9.42953H16.7619V8.38193ZM16.7619 5.23909H17.8095V6.28667H16.7619V5.23909ZM16.7619 4.19141H17.8095V5.23909H16.7619V4.19141ZM16.7619 7.33427H17.8095V8.38193H16.7619V7.33427ZM16.7619 6.28667H17.8095V7.33427H16.7619V6.28667ZM15.7143 8.38193H16.7619V9.42953H15.7143V8.38193ZM15.7143 7.33427H16.7619V8.38193H15.7143V7.33427ZM14.6666 8.38193H15.7143V9.42953H14.6666V8.38193ZM13.619 9.42953H14.6666V10.4771H13.619V9.42953Z"
      fill="#F77621"
    />
    <path
      d="M13.619 10.4766H14.6666V11.5241H13.619V10.4766ZM12.5714 10.4766H13.619V11.5241H12.5714V10.4766Z"
      fill="white"
    />
    <path
      d="M13.619 1.04688H14.6666V2.09456H13.619V1.04688ZM11.5238 1.04688H12.5714V2.09456H11.5238V1.04688ZM12.5714 1.04688H13.619V2.09456H12.5714V1.04688ZM14.6666 2.09456H15.7143V3.14214H14.6666V2.09456Z"
      fill="#F77621"
    />
    <path
      d="M14.6666 3.14214H15.7143V4.18972H14.6666V3.14214ZM13.619 7.33258H14.6666V8.38024H13.619V7.33258ZM15.7143 6.285H16.7619V7.33258H15.7143V6.285ZM15.7143 5.2374H16.7619V6.285H15.7143V5.2374ZM12.5714 11.523H13.619V12.5707H12.5714V11.523ZM15.7143 4.18972H16.7619V5.2374H15.7143V4.18972ZM15.7143 3.14214H16.7619V4.18972H15.7143V3.14214ZM14.6666 7.33258H15.7143V8.38024H14.6666V7.33258ZM14.6666 6.285H15.7143V7.33258H14.6666V6.285ZM12.5714 9.42784H13.619V10.4754H12.5714V9.42784ZM13.619 2.09454H14.6666V3.14214L13.619 3.14212L13.619 2.09454ZM13.619 8.38024H14.6666V9.42784H13.619L13.619 8.38024ZM11.5238 9.42784H12.5714V10.4754H11.5238V9.42784ZM11.5238 2.09454H12.5714V3.14212H11.5238V2.09454ZM12.5714 2.09454H13.619L13.619 3.14212H12.5714V2.09454ZM10.4762 1.04688H11.5237V2.09454H10.4762V1.04688ZM12.5714 8.38024H13.619L13.619 9.42784H12.5714V8.38024ZM10.4762 2.09454H11.5237V3.14212H10.4762V2.09454ZM9.42859 1.04688H10.4762V2.09454H9.42859V1.04688Z"
      fill="#F77621"
    />
    <path
      d="M12.5714 13.6191H13.619V14.6667H12.5714V13.6191ZM13.619 13.6191H14.6666V14.6667H13.619V13.6191ZM10.4762 13.6191H11.5237V14.6667H10.4762V13.6191ZM9.42859 13.6191H10.4762V14.6667H9.42859V13.6191ZM6.28571 13.6191H7.3333V14.6667H6.28573L6.28571 13.6191ZM7.3333 13.6191H8.38097V14.6667H7.3333V13.6191ZM8.38097 13.6191H9.42857V14.6667H8.38097V13.6191Z"
      fill="#4C4F65"
    />
    <path
      d="M12.5714 12.5723H13.619V13.6198H12.5714V12.5723ZM9.42856 12.5723H10.4761V13.6198H9.42856V12.5723ZM10.4761 12.5723H11.5238V13.6198H10.4762L10.4761 12.5723ZM7.3333 12.5723H8.38096V13.6198H7.3333V12.5723ZM8.38096 12.5723H9.42856V13.6198H8.38096V12.5723Z"
      fill="#F77621"
    />
    <path
      d="M11.5238 13.6191H12.5714V14.6667H11.5238V13.6191Z"
      fill="#4C4F65"
    />
    <path
      d="M10.4762 8.38112H11.5237V9.42872H10.4762V8.38112ZM11.5237 11.5239H12.5714V12.5716H11.5238L11.5237 11.5239ZM11.5237 7.33346H12.5714V8.38112H11.5238L11.5237 7.33346ZM10.4762 10.4763H11.5237V11.5239H10.4762V10.4763ZM10.4762 5.23828H11.5237V6.28586H10.4762V5.23828ZM10.4762 9.42872H11.5237V10.4763H10.4762V9.42872ZM11.5237 10.4763H12.5714V11.5239H11.5238L11.5237 10.4763ZM11.5237 6.28586H12.5714V7.33346H11.5238L11.5237 6.28586ZM11.5237 12.5716H12.5714V13.6192H11.5238L11.5237 12.5716ZM10.4762 6.28586H11.5237V7.33346H10.4762V6.28586ZM11.5237 8.38112H12.5714V9.42872H11.5238L11.5237 8.38112ZM9.42859 5.23828H10.4762V6.28586H9.42859V5.23828Z"
      fill="#F77621"
    />
    <path d="M9.42857 4.19141H10.4762V5.23909H9.42857V4.19141Z" fill="white" />
    <path
      d="M9.42857 3.14258H10.4761V4.19016H9.42857V3.14258ZM4.19047 4.19016H5.23813V5.23784H4.19044L4.19047 4.19016ZM6.28571 4.19016H7.33331V5.23784H6.28573L6.28571 4.19016ZM5.23813 4.19016H6.28571L6.28573 5.23784H5.23813V4.19016ZM7.33331 6.28542H8.38097V7.33302H7.33331V6.28542ZM7.33331 7.33302H8.38097V8.38068H7.33331V7.33302ZM9.42857 11.5235H10.4761V12.5711H9.42857V11.5235ZM9.42857 10.4759H10.4761V11.5235H9.42857V10.4759ZM9.42857 9.42831H10.4761V10.4759H9.42857V9.42831Z"
      fill="#F77621"
    />
    <path
      d="M6.28571 8.38086H7.3333V9.42846H6.28573L6.28571 8.38086Z"
      fill="#FEAD35"
    />
    <path
      d="M6.28571 7.33258H7.3333V8.38024H6.28573L6.28571 7.33258ZM7.3333 8.38024H8.38097V9.42784H7.3333V8.38024ZM6.28573 5.2374H7.3333V6.28498H6.28573V5.2374ZM6.28573 6.28498H7.3333V7.33258H6.28571L6.28573 6.28498ZM8.38097 9.42784H9.42857V10.4754H8.38099L8.38097 9.42784ZM8.38097 11.523H9.42857V12.5707H8.38099L8.38097 11.523ZM8.38097 10.4754L9.42857 10.4754V11.523H8.38099L8.38097 10.4754ZM8.38097 7.33258H9.42857V8.38024H8.38097V7.33258ZM8.38097 5.2374H9.42857V6.28498H8.38099L8.38097 5.2374ZM8.38099 6.28498H9.42857V7.33258H8.38097L8.38099 6.28498ZM8.38097 8.38024H9.42857V9.42784H8.38097V8.38024ZM7.3333 3.14214H8.38097V4.18972H7.3333V3.14214ZM6.28573 1.04688H7.3333V2.09454H6.28573V1.04688Z"
      fill="#F77621"
    />
    <path
      d="M8.38097 4.19016H9.42857V5.23784H8.38099L8.38097 4.19016ZM8.38097 3.14258H9.42857V4.19016H8.38097V3.14258Z"
      fill="white"
    />
    <path
      d="M8.38097 1.04688H9.42857V2.09456H8.38099L8.38097 1.04688ZM7.33331 4.18974H8.38097V5.23742H7.33331V4.18974ZM7.33331 1.0469H8.38097L8.38099 2.09456H7.33331V1.0469ZM8.38099 2.09456H9.42857V3.14214H8.38099V2.09456ZM7.33331 5.23742H8.38097V6.285H7.33331V5.23742ZM5.23813 2.09456H6.28571V3.14214H5.23813V2.09456ZM7.33331 2.09456H8.38099V3.14214H7.33331V2.09456ZM4.19044 3.14214H5.23813V4.18974H4.19044V3.14214Z"
      fill="#F77621"
    />
    <path
      d="M5.2381 3.1433H6.2857V4.19088H5.23812L5.2381 3.1433ZM6.2857 3.1433H7.3333V4.19088H6.2857V3.1433ZM6.2857 2.0957H7.3333V3.1433L6.28572 3.14328L6.2857 2.0957Z"
      fill="#F77621"
    />
    <path
      d="M4.19044 8.38086H5.23813V9.42846H4.19044V8.38086Z"
      fill="#FEAD35"
    />
    <path
      d="M6.28571 11.5228H7.33331V12.5705H6.28573L6.28571 11.5228ZM6.28571 10.4752H7.33331V11.5228H6.28573L6.28571 10.4752ZM4.19045 9.42762H5.23813V10.4752H4.19045V9.42762ZM5.23813 9.42762H6.28571V10.4752H5.23813V9.42762ZM5.23813 10.4752H6.28571L6.28573 11.5228H5.23813V10.4752ZM3.14287 6.28472H4.19045V7.33232H3.14287V6.28472ZM3.14287 7.33232H4.19045V8.37998H3.14287V7.33232ZM3.14287 8.37998H4.19045V9.42758H3.14287V8.37998ZM3.14287 5.23714H4.19045V6.28472H3.14287V5.23714ZM3.14287 4.18945H4.19045V5.23714H3.14287V4.18945Z"
      fill="#F77621"
    />
    <path
      d="M5.2381 1.04758H6.2857V2.09526H5.23812L5.2381 1.04758ZM4.19044 2.09526H5.23812V3.14284H4.19044V2.09526ZM3.14286 3.14284H4.19044V4.19044H3.14286V3.14284ZM2.09526 5.23813H3.14284V6.28571H2.09526V5.23813ZM2.09526 4.19044H3.14286L3.14284 5.23813H2.09526V4.19044ZM2.09526 8.38097H3.14284V9.42857H2.09526V8.38097ZM2.09526 7.3333H3.14284V8.38097H2.09526V7.3333ZM2.09526 6.28571H3.14284V7.3333H2.09526V6.28571ZM3.14284 9.42857H4.19044V10.4761H3.14286L3.14284 9.42857ZM4.19044 10.4761H5.23812V11.5238H4.19044V10.4761ZM5.23812 12.5714H6.2857V13.619H5.23812V12.5714ZM5.23812 13.619H6.2857V14.6666H5.23812V13.619ZM5.23812 11.5238H6.2857V12.5714H5.23812V11.5238ZM5.23812 17.8095H6.2857V18.8571H5.23812V17.8095ZM5.23812 16.7619H6.2857V17.8095H5.23812V16.7619ZM5.23812 14.6666H6.2857V15.7143H5.23812V14.6666ZM5.23812 15.7143H6.2857V16.7619H5.23812V15.7143ZM5.23812 18.8571H6.2857V19.9047H5.23812V18.8571ZM6.2857 19.9047H7.3333V20.9523H6.28572L6.2857 19.9047ZM12.5714 20.9523H13.619V22H12.5714V20.9523ZM9.42856 20.9523H10.4761V22H9.42856V20.9523ZM10.4761 20.9523H11.5238V22H10.4762L10.4761 20.9523ZM11.5238 20.9523H12.5714V22H11.5238V20.9523ZM8.38097 20.9523H9.42856V22H8.38099L8.38097 20.9523ZM7.3333 20.9523H8.38097L8.38099 22H7.3333V20.9523ZM13.619 19.9047H14.6666V20.9523H13.619L13.619 19.9047ZM14.6666 14.6666H15.7143V15.7143H14.6666V14.6666ZM14.6666 18.8572H15.7143V19.9047H14.6666V18.8572ZM14.6666 16.7619H15.7143V17.8095H14.6666V16.7619ZM14.6666 17.8095H15.7143V18.8571H14.6666V17.8095ZM14.6666 15.7143H15.7143V16.7619H14.6666V15.7143ZM14.6666 13.619H15.7143V14.6666H14.6666V13.619ZM14.6666 12.5714H15.7143V13.619H14.6666V12.5714ZM14.6666 11.5238H15.7143V12.5714H14.6666V11.5238ZM15.7143 10.4762H16.7619V11.5237H15.7143V10.4762ZM16.7619 9.42859H17.8095V10.4762H16.7619V9.42859ZM17.8095 4.19044H18.8571V5.23813H17.8095V4.19044ZM17.8095 6.28571H18.8571V7.3333H17.8095V6.28571ZM17.8095 8.38097H18.8571V9.42857H17.8095V8.38097ZM17.8095 5.23813H18.8571V6.28571H17.8095V5.23813ZM17.8095 7.3333H18.8571V8.38097H17.8095V7.3333ZM16.7619 3.14286H17.8095V4.19044H16.7619V3.14286ZM15.7143 2.09526H16.7619V3.14284H15.7143V2.09526ZM14.6666 1.0476H15.7143V2.09526H14.6666V1.0476ZM13.619 0H14.6666V1.04758H13.619V0ZM12.5714 0H13.619V1.04758H12.5714V0ZM11.5238 0H12.5714V1.04758H11.5238V0ZM10.4762 0H11.5237V1.04758H10.4762V0ZM9.42859 0H10.4762V1.04758H9.42859V0ZM8.38097 0H9.42856V1.04758H8.38099L8.38097 0ZM7.3333 0H8.38097L8.38099 1.04758H7.3333V0ZM6.28572 0H7.3333V1.04758H6.2857L6.28572 0Z"
      fill="#1D2033"
    />
  </svg>
);