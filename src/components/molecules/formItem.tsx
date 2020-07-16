import React from "react";
import {
  FormControl,
  FormLabel,
  Tooltip,
  Input,
  useColorMode,
} from "@chakra-ui/core";
import { InfoIcon } from "../../theme/icons";

type FormItemProps = {
  label: string;
  description: string;
  name: string;
  register: any;
};

const FormItem = ({ label, description, name, register }: FormItemProps) => {
  const { colorMode } = useColorMode();
  return (
    <FormControl d="flex" alignItems="center" mt={4}>
      <FormLabel
        fontWeight={500}
        color={`mode.${colorMode}.title`}
        minW="180px"
        mr={4}
        p={0}
      >
        {label}
        <Tooltip
          hasArrow
          label={description}
          aria-label={description}
          placement="right"
        >
          <InfoIcon boxSize="12px" ml={2} color={`mode.${colorMode}.text`} />
        </Tooltip>
      </FormLabel>
      <Input
        borderColor={`mode.${colorMode}.icon`}
        color={`mode.${colorMode}.text`}
        borderRadius="sm"
        size="sm"
        name={name}
        ref={register}
      />
    </FormControl>
  );
};

export default FormItem;
