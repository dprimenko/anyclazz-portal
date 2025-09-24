import { Loader as LoaderStyled } from './styles';

export function Loader({ color, backgroundColor }: { color: string, backgroundColor: string }) {
	return (
		<LoaderStyled $color={color} $backgroundColor={backgroundColor} />
	)
}