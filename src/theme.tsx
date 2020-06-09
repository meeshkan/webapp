import { theme } from "@chakra-ui/core";

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    gray: {
      50: "#F5F7FA",
      100: "#E4E7EB",
      200: "#CBD2D9",
      300: "#9AA5B1",
      400: "#7B8794",
      500: "#616E7C",
      600: "#52606D",
      700: "#3E4C59",
      800: "#323F4B",
      900: "#1F2933"
    },
    red: {
      50: "#FCE8EE",
      100: "#FAD3DF",
      200: "#F5A3BC",
      300: "#F0759A",
      400: "#EB4778",
      500: "#DC1853",
      600: "#B81445",
      700: "#A1123D",
      800: "#8A0F34",
      900: "#5C0A23"
    },
    blue: {
      50: "#E9EDFB",
      100: "#D4DBF7",
      200: "#A8B7F0",
      300: "#7D92E8",
      400: "#526EE0",
      500: "#264AD9",
      600: "#1F3BAD",
      700: "#1B3498",
      800: "#172C82",
      900: "#0F1E57"
    },
    cyan: {
      50: "#E9FBF8",
      100: "#D4F7F1",
      200: "#A8F0E1",
      300: "#7DE8D3",
      400: "#52E0C4",
      500: "#33CCAE",
      600: "#29A38B",
      700: "#248F79",
      800: "#1F7A68",
      900: "#145246"
    },
    mode: {
      light: {
        background: "#F5F7FA", // gray.50
        card: theme.colors.white,
        title: "#1F2933", // gray.900
        titleHover: "#DC1853", // red.500
        text: "#3E4C59", // gray.700
        alertText: "#5F370E", // yellow.900
        tertiary: "#616E7C", // gray.500
        icon: "#E4E7EB", // gray.100
        link: "#264AD9" // blue.500
      },
      dark: {
        background: "#323F4B", // gray.800
        card: "#1F2933", // gray.900
        title: theme.colors.white,
        titleHover: "#F0759A", // red.300
        text: "#CBD2D9", // gray.200
        alertText: "#FEFCBF", // yellow.100
        tertiary: "#7B8794", // gray.400
        icon: "#323F4B", // gray.800
        link: "#7D92E8" // blue.300
      }
    }
  },
  icons: {
    ...theme.icons,
    Logo: {
      path: (
        <g fill="currentColor">
          <path
            d="M7.17237 0.0666744C4.68072 0.626285 2.91129 2.68421 2.69463 5.24758C2.40574 8.98433 6.35987 10.9339 11.9209 9.76057C12.7876 9.58005 13.5459 9.47174 13.6001 9.52589C13.6543 9.58005 11.0001 12.5767 7.67792 16.1871C1.17797 23.2815 0.834919 23.6786 0.275202 24.9242C-0.374793 26.4045 0.148814 27.975 1.6113 28.9137C2.31546 29.365 2.53213 29.4191 4.01267 29.4191C5.40294 29.4011 5.76405 29.3289 6.54043 28.9317C7.04598 28.679 7.62375 28.2638 7.84042 28.0291C8.03903 27.8125 9.42929 25.7004 10.9098 23.3717C14.8279 17.198 17.1751 13.75 17.807 13.2085C18.4931 12.6308 19.3056 12.4684 20.6959 12.5947C22.0139 12.703 22.7903 13.1002 23.1695 13.8584C23.4222 14.3458 23.4764 14.9234 23.4403 17.2882C23.3861 21.9456 23.332 22.433 22.8625 22.9385C22.5917 23.2273 22.2486 23.3717 21.8695 23.3717C19.3417 23.3717 18.1139 24.509 17.8973 27.0724C17.7348 29.0761 18.3667 29.6358 21.1653 29.9065C24.9389 30.2676 27.5569 29.5816 28.7847 27.8667C29.8861 26.3142 29.9944 25.5019 29.9944 18.3172C30.0125 11.9629 30.0125 11.9087 29.5791 10.97C28.7125 9.02044 26.0944 7.34161 23.1695 6.83615C22.357 6.69174 19.6848 6.51122 17.1931 6.42096C13.7626 6.31265 12.5168 6.20434 12.0112 5.98771C11.6321 5.82524 11.3251 5.62667 11.3251 5.55446C11.3251 5.48226 11.5779 5.04901 11.8668 4.61576C12.9501 3.00914 12.2459 1.05953 10.3321 0.391607C9.35707 0.0486203 7.94875 -0.0957931 7.17237 0.0666744Z"
            fill="#DC1853"
          />
          <path d="M54.8 9H50.96L46.4 16.464L41.84 9H38V25.8H41.84V16.032L46.184 23.16H46.616L50.96 16.032V25.8H54.8V9Z" />
          <path d="M60.7835 21.24H69.3035C69.3995 20.784 69.4475 20.304 69.4475 19.8C69.4475 16.176 66.8555 13.464 63.3515 13.464C59.5595 13.464 56.9675 16.224 56.9675 19.8C56.9675 23.376 59.5115 26.136 63.6155 26.136C65.8955 26.136 67.6715 25.296 68.8475 23.664L65.9675 22.008C65.4875 22.536 64.6475 22.92 63.6635 22.92C62.3435 22.92 61.2395 22.488 60.7835 21.24ZM60.7115 18.552C61.0475 17.328 61.9595 16.656 63.3275 16.656C64.4075 16.656 65.4875 17.16 65.8715 18.552H60.7115Z" />
          <path d="M74.5882 21.24H83.1082C83.2042 20.784 83.2522 20.304 83.2522 19.8C83.2522 16.176 80.6602 13.464 77.1562 13.464C73.3642 13.464 70.7722 16.224 70.7722 19.8C70.7722 23.376 73.3162 26.136 77.4202 26.136C79.7002 26.136 81.4762 25.296 82.6522 23.664L79.7722 22.008C79.2922 22.536 78.4522 22.92 77.4682 22.92C76.1482 22.92 75.0442 22.488 74.5882 21.24ZM74.5162 18.552C74.8522 17.328 75.7642 16.656 77.1322 16.656C78.2122 16.656 79.2922 17.16 79.6762 18.552H74.5162Z" />
          <path d="M88.2333 17.304C88.2333 16.872 88.6173 16.632 89.2413 16.632C90.0333 16.632 90.5133 17.064 90.8493 17.688L93.9213 16.032C92.9133 14.328 91.1853 13.464 89.2413 13.464C86.7453 13.464 84.5373 14.784 84.5373 17.4C84.5373 21.552 90.4413 20.856 90.4413 22.176C90.4413 22.656 90.0093 22.92 89.1453 22.92C88.0893 22.92 87.4173 22.416 87.1053 21.504L83.9853 23.28C84.9213 25.224 86.7453 26.136 89.1453 26.136C91.7373 26.136 94.1373 24.96 94.1373 22.2C94.1373 17.76 88.2333 18.672 88.2333 17.304Z" />
          <path d="M102.967 13.464C101.383 13.464 100.183 14.04 99.5347 14.928V9H95.9347V25.8H99.5347V19.248C99.5347 17.544 100.447 16.776 101.767 16.776C102.919 16.776 103.855 17.472 103.855 18.96V25.8H107.455V18.432C107.455 15.192 105.391 13.464 102.967 13.464Z" />
          <path d="M121.447 25.8L116.959 19.8L121.327 13.8H117.127L113.527 19.056V9H109.927V25.8H113.527V20.496L117.367 25.8H121.447Z" />
          <path d="M130.756 13.8V14.928C129.964 14.016 128.788 13.464 127.18 13.464C124.036 13.464 121.444 16.224 121.444 19.8C121.444 23.376 124.036 26.136 127.18 26.136C128.788 26.136 129.964 25.584 130.756 24.672V25.8H134.356V13.8H130.756ZM127.9 22.728C126.244 22.728 125.044 21.6 125.044 19.8C125.044 18 126.244 16.872 127.9 16.872C129.556 16.872 130.756 18 130.756 19.8C130.756 21.6 129.556 22.728 127.9 22.728Z" />
          <path d="M144.029 13.464C142.445 13.464 141.245 14.04 140.597 14.928V13.8H136.997V25.8H140.597V19.248C140.597 17.544 141.509 16.776 142.829 16.776C143.981 16.776 144.917 17.472 144.917 18.96V25.8H148.517V18.432C148.517 15.192 146.453 13.464 144.029 13.464Z" />
        </g>
      ),
      viewBox: "0 0 149 30"
    },
    add: {
      path: (
        <path
          d="M8 12H12M12 12H16M12 12V16M12 12V8M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
        />
      ),
      viewBox: "0 0 24 24"
    },
    slack: {
      path: (
        <path
          d="M2.86143 10.1107C2.86143 10.7596 2.32957 11.2914 1.68071 11.2914C1.03186 11.2914 0.5 10.7596 0.5 10.1107C0.5 9.46186 1.03186 8.93 1.68071 8.93H2.86143V10.1107ZM4.70857 10.1107C4.70857 9.46186 5.24043 8.93 5.88929 8.93C6.53814 8.93 7.07 9.46186 7.07 10.1107V14.3193C7.07 14.9681 6.53814 15.5 5.88929 15.5C5.24043 15.5 4.70857 14.9681 4.70857 14.3193V10.1107ZM5.88929 2.86143C5.24043 2.86143 4.70857 2.32957 4.70857 1.68071C4.70857 1.03186 5.24043 0.5 5.88929 0.5C6.53814 0.5 7.07 1.03186 7.07 1.68071V2.86143H5.88929ZM5.88929 4.70857C6.53814 4.70857 7.07 5.24043 7.07 5.88929C7.07 6.53814 6.53814 7.07 5.88929 7.07H1.68071C1.03186 7.07 0.5 6.53814 0.5 5.88929C0.5 5.24043 1.03186 4.70857 1.68071 4.70857H5.88929ZM13.1386 5.88929C13.1386 5.24043 13.6704 4.70857 14.3193 4.70857C14.9681 4.70857 15.5 5.24043 15.5 5.88929C15.5 6.53814 14.9681 7.07 14.3193 7.07H13.1386V5.88929ZM11.2914 5.88929C11.2914 6.53814 10.7596 7.07 10.1107 7.07C9.46186 7.07 8.93 6.53814 8.93 5.88929V1.68071C8.93 1.03186 9.46186 0.5 10.1107 0.5C10.7596 0.5 11.2914 1.03186 11.2914 1.68071V5.88929ZM10.1107 13.1386C10.7596 13.1386 11.2914 13.6704 11.2914 14.3193C11.2914 14.9681 10.7596 15.5 10.1107 15.5C9.46186 15.5 8.93 14.9681 8.93 14.3193V13.1386H10.1107ZM10.1107 11.2914C9.46186 11.2914 8.93 10.7596 8.93 10.1107C8.93 9.46186 9.46186 8.93 10.1107 8.93H14.3193C14.9681 8.93 15.5 9.46186 15.5 10.1107C15.5 10.7596 14.9681 11.2914 14.3193 11.2914H10.1107Z"
          stroke="currentColor"
          fill="currentColor"
        />
      ),
      viewBox: "0 0 16 16"
    },
    info: {
      path: (
        <path
          d="M6 9V5.61538M6 3.69231V3.30769M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6Z"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ),
      viewBox: "0 0 12 12"
    },
    github: {
      path: (
        <path
          d="M5.35161 12.5613C5.35161 12.6258 5.27742 12.6774 5.18387 12.6774C5.07742 12.6871 5.00322 12.6355 5.00322 12.5613C5.00322 12.4968 5.07742 12.4452 5.17096 12.4452C5.26774 12.4354 5.35161 12.4871 5.35161 12.5613ZM4.34839 12.4161C4.32581 12.4807 4.39033 12.5549 4.4871 12.5742C4.57097 12.6065 4.66774 12.5742 4.68709 12.5096C4.70646 12.4452 4.64516 12.371 4.54839 12.3419C4.46452 12.3193 4.37096 12.3516 4.34839 12.4161ZM5.7742 12.3613C5.68064 12.3839 5.61613 12.4452 5.62581 12.5194C5.63548 12.5838 5.71935 12.6258 5.81613 12.6032C5.90967 12.5806 5.97419 12.5194 5.96452 12.4548C5.95484 12.3935 5.86774 12.3516 5.7742 12.3613ZM7.89677 0C3.42259 0 0 3.39678 0 7.87097C0 11.4484 2.25161 14.5097 5.46774 15.5871C5.88065 15.6613 6.02581 15.4064 6.02581 15.1968C6.02581 14.9968 6.01613 13.8936 6.01613 13.2161C6.01613 13.2161 3.75807 13.7 3.28387 12.2549C3.28387 12.2549 2.91613 11.3161 2.3871 11.0742C2.3871 11.0742 1.64839 10.5677 2.43871 10.5775C2.43871 10.5775 3.24194 10.6419 3.68387 11.4097C4.39033 12.6548 5.57419 12.2968 6.03548 12.0839C6.10968 11.5678 6.31936 11.2097 6.55161 10.9968C4.74839 10.7967 2.92903 10.5355 2.92903 7.43226C2.92903 6.54516 3.17419 6.1 3.69033 5.53226C3.60645 5.32258 3.33226 4.45806 3.7742 3.34193C4.44839 3.13226 6 4.2129 6 4.2129C6.64516 4.03226 7.33872 3.93871 8.02581 3.93871C8.7129 3.93871 9.40645 4.03226 10.0516 4.2129C10.0516 4.2129 11.6033 3.12903 12.2774 3.34193C12.7194 4.46129 12.4452 5.32258 12.3613 5.53226C12.8774 6.10322 13.1935 6.54839 13.1935 7.43226C13.1935 10.5452 11.2935 10.7935 9.49032 10.9968C9.78711 11.2516 10.0388 11.7355 10.0388 12.4936C10.0388 13.5807 10.029 14.9258 10.029 15.1903C10.029 15.4 10.1774 15.6548 10.5871 15.5806C13.8129 14.5097 16 11.4484 16 7.87097C16 3.39678 12.371 0 7.89677 0ZM3.13548 11.1258C3.09355 11.1581 3.10323 11.2323 3.15806 11.2935C3.20968 11.3452 3.28387 11.3677 3.32581 11.3258C3.36774 11.2935 3.35807 11.2194 3.30322 11.1581C3.25162 11.1065 3.17742 11.0839 3.13548 11.1258ZM2.7871 10.8645C2.76452 10.9064 2.79677 10.9581 2.86129 10.9904C2.91291 11.0225 2.97742 11.0129 3 10.9678C3.02258 10.9258 2.99032 10.8741 2.92581 10.842C2.86129 10.8226 2.80968 10.8322 2.7871 10.8645ZM3.83226 12.0129C3.78064 12.0548 3.8 12.1516 3.87419 12.2129C3.94839 12.2871 4.04194 12.2968 4.08387 12.2451C4.12581 12.2032 4.10645 12.1065 4.04194 12.0451C3.97096 11.9709 3.87419 11.9613 3.83226 12.0129ZM3.46452 11.5387C3.4129 11.571 3.4129 11.6548 3.46452 11.729C3.51613 11.8032 3.60323 11.8355 3.64516 11.8032C3.69677 11.7613 3.69677 11.6775 3.64516 11.6033C3.6 11.5291 3.51613 11.4968 3.46452 11.5387Z"
          fill="currentColor"
        />
      ),
      viewBox: "0 0 16 16"
    },
    checkmark: {
      path: (
        <path
          d="M16.3198 1.28003L6.94482 15.28L1.31982 10.28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ),
      viewBox: "0 0 18 16"
    },
    xmark: {
      path: (
        <path
          d="M1 15L15 1M15 15L1 1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ),
      viewBox: "0 0 16 16"
    }
  },
  opacity: {
    "0": "0",
    "20%": "0.2",
    "40%": "0.4",
    "60%": "0.6",
    "80%": "0.8",
    "100%": "1"
  },
  fonts: {
    body: `Inter, sans-serif`,
    heading: `Inter, sans-serif`,
    mono: "Fira Code, monospace"
  },
  fontWeights: {
    ...theme.fontWeights,
    100: 100,
    200: 200,
    300: 300,
    400: 400,
    500: 500,
    600: 600,
    700: 700,
    800: 800,
    900: 900
  }
};

export default customTheme;
