"use client";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect } from "react";

const DeBridgeWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.debridge.finance/assets/scripts/widget.js";
    script.async = true;
    script.onload = () => {
      if (window.deBridge) {
        window.deBridge.widget({
          v: "1",
          element: "debridgeWidget",
          title: "Kolective Bridge",
          description: "",
          width: "600",
          height: "550",
          r: null,
          supportedChains: {
            inputChains: {
              1: "all",
              10: "all",
              56: "all",
              100: "all",
              137: "all",
              146: "all",
              250: "all",
              388: "all",
              998: "all",
              1088: "all",
              1514: "all",
              2741: "all",
              4158: "all",
              7171: "all",
              8453: "all",
              42161: "all",
              43114: "all",
              59144: "all",
              80094: "all",
              7565164: "all",
              245022934: "all",
            },
            outputChains: {
              1: "all",
              10: "all",
              56: "all",
              100: "all",
              137: "all",
              146: "all",
              250: "all",
              388: "all",
              998: "all",
              1088: "all",
              1514: "all",
              2741: "all",
              4158: "all",
              7171: "all",
              8453: "all",
              42161: "all",
              43114: "all",
              59144: "all",
              80094: "all",
              7565164: "all",
              245022934: "all",
            },
          },
          inputChain: 56,
          outputChain: 146,
          inputCurrency: "",
          outputCurrency: "",
          address: "",
          showSwapTransfer: true,
          amount: "",
          outputAmount: "",
          isAmountFromNotModifiable: false,
          isAmountToNotModifiable: false,
          lang: "en",
          mode: "deswap",
          isEnableCalldata: false,
          styles: "e30=",
          theme: "dark",
          isHideLogo: false,
          logo: "",
          disabledWallets: [],
          disabledElements: [],
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="debridgeWidget"></div>
  );
};

export default DeBridgeWidget;