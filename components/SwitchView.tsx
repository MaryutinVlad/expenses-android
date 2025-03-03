import { Pressable, Image } from "react-native";

type Props = {
  onSwitchMonth(): void,
  reversed: boolean,
  disabled: boolean,
};

export default function SwitchView({
  onSwitchMonth,
  reversed,
  disabled,
}: Props) {

  const switchMonth = () => {
    onSwitchMonth();
  };

  return (
    <Pressable
     onPress={switchMonth}
     disabled={disabled}
    >
      <Image
        source={ disabled ? require("@/assets/images/line.png") : require("@/assets/images/arrow.png")}
        style={{
          width: 35,
          height: 35,
          transform: `${reversed && "rotate(180deg)"} ${disabled && "rotate(90deg)"}`,
        }}
      />
    </Pressable>
  )
}