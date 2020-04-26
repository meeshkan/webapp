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
      900: "#1F2933",
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
      900: "#5C0A23",
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
      900: "#0F1E57",
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
      900: "#145246",
    },
    mode: {
      light: {
        background: "#F5F7FA", // gray.50
        card: theme.colors.white,
        title: "#1F2933", // gray.900
        titleHover: "#DC1853", // red.500
        text: "#3E4C59", // gray.700
        icon: "#E4E7EB", // gray.100
      },
      dark: {
        background: "#323F4B", // gray.800
        card: "#1F2933", // gray.900
        title: theme.colors.white,
        titleHover: "#F0759A", // red.300
        text: "#CBD2D9", // gray.200
        icon: "#323F4B", // gray.800
      },
    },
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
      viewBox: "0 0 149 30",
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
      viewBox: "0 0 24 24",
    },
  },
  fonts: {
    body: `Inter, sans-serif`,
    heading: `Inter, sans-serif`,
    mono: "Fira Code, monospace",
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
    900: 900,
  },
};

export default customTheme;
