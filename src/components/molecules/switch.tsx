import * as React from "react";
import { useAnimation, motion } from "framer-motion";
import { Box, BoxProps, useColorMode } from "@chakra-ui/core";

const MotionBox = motion.custom(Box);

// TypeScript ‘type alias’
type Props = Partial<BoxProps> &
  Partial<{
    // Optional props
    mode: boolean;
    setCurrentBy: boolean;
    currentIndex: number;
    currentOption: string;
    onValueChange: (option: string, index: number) => void;
  }> & {
    // Required props
    options: string[];
  };

// passing the `Props` type alias to the component
export function SegmentedControl(props: Props) {
  // Splitting up the props
  const {
    width,
    mode,
    setCurrentBy,
    currentIndex,
    options,
    currentOption,
    onValueChange,
  } = props;

  // The initial selected index is set by prop.currentIndex or prop.currentOption
  // (depending on which was selected with props.setCurrentBy)
  let initialIndex;
  if (setCurrentBy === true) {
    initialIndex = currentIndex;
  } else {
    initialIndex = options.indexOf(currentOption);
  }
  const [index, setIndex] = React.useState(initialIndex); // The ‘index’ state

  // An AnimationControls object for the Selection Indicator
  const selectionIndicator = useAnimation();

  // Calculating the width of each segment
  const widthSegment =
    ((width as number) - (options.length - 1)) / options.length;

  // Change selection function
  const changeSelectedIndex = (newIndex) => {
    // Move the Selection Indicator
    selectionIndicator.start({ x: newIndex * widthSegment + newIndex * 1 });

    // Trigger the event property
    onValueChange(options[newIndex], newIndex);
    // Update the index state
    setIndex(newIndex);
  };

  // Handle Tap event
  const handleTap = (newIndex) => {
    changeSelectedIndex(newIndex);
  };

  // Update the selected index whenever props.options, props.setCurrentBy,
  // props.currentIndex or props.currentOption change
  React.useEffect(() => {
    let newIndex;
    if (setCurrentBy === true) {
      newIndex = currentIndex;
    } else {
      newIndex = options.indexOf(currentOption);
    }
    changeSelectedIndex(newIndex);
  }, [options, setCurrentBy, currentIndex, currentOption]);

  const { colorMode } = useColorMode();
  return (
    <MotionBox
      // name="Segmented control"
      width={width}
      height={8}
      backgroundColor={colorMode === "light" ? "gray.100" : "gray.900"}
      borderRadius="sm"
      overflow="hidden"
      display="flex"
      position="relative"
    >
      <MotionBox
        // name="Selection Indicator"
        width={widthSegment - 4}
        ml="2px"
        height={28}
        backgroundColor={colorMode === "light" ? "white" : "gray.800"}
        borderRadius="sm"
        mt="2px"
        left={2}
        shadow="0px 3px 8px rgba(0,0,0,.12), 0px 3px 1px rgba(0,0,0,.04)"
        animate={selectionIndicator}
        initial={{ x: index * widthSegment + index * 1 }}
        transition="spring 20 0.3"
      />
      {options.map((option, i) => {
        return (
          <MotionBox
            // name="Segment"
            key={`${props.id}_option_${i}`}
            width={widthSegment}
            height="100%"
            backgroundColor=""
            left={i * widthSegment + i * 1}
            color={`mode.${colorMode}.title`}
            fontWeight={i === index ? 900 : 700}
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
            onClick={() => handleTap(i)}
          >
            {option}
          </MotionBox>
        );
      })}
    </MotionBox>
  );
}

SegmentedControl.defaultProps = {
  width: 204,
  height: 32,
  mode: true,
  setCurrentBy: true,
  currentIndex: 0,
  currentOption: "RESTful",
  options: ["Cherry", "Kiwi", "Banana", "Mango", "Lemon"],
  onValueChange: (option, index) => null,
};
