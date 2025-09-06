import {COLORS} from "@/constants/colors";
import {createContext, ReactElement, useContext, useRef} from "react";
import {ActivityIndicator} from "react-native";

const LoaderContext = createContext({isLoading: {current:false}, setLoader});
export const LoaderProvider = ({children}:{children: ReactElement}) => {
  const isLoading = useRef(false);
  const setLoader = (value: boolean) => {
    isLoading.current = value
  }
  return (
    <LoaderContext.Provider value={{isLoading, setLoader}}>
      { isLoading.current && <ActivityIndicator size={"small"} color={COLORS.primary} />}
      {children}
    </LoaderContext.Provider>
  )
}
export const useLoaderContext = () => {
    return useContext(LoaderContext);

}