import { EdgeInsets } from "react-native-safe-area-context";

/**
 * Retorna os paddings verticais simétricos para footers e barras de ação inferiores,
 * garantindo que o respiro visual acima e abaixo do botão seja rigorosamente idêntico,
 * respeitando os insets de safe area do Android (gestos/3 botões) e iOS (home indicator).
 *
 * @param insets Insets retornados por useSafeAreaInsets()
 * @param baseSpacing Espaçamento base do tema (ex: theme.spacing.md ou theme.spacing.lg)
 */
export function getFooterVerticalPadding(insets: EdgeInsets, baseSpacing: number) {
  return {
    paddingTop: baseSpacing,
    paddingBottom: baseSpacing + insets.bottom,
  };
}

