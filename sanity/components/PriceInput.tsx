import { NumberInputProps, set, unset } from "sanity";
import { Stack, Text, TextInput } from "@sanity/ui";
import { useCallback, useMemo } from "react";

export const PriceInput = (props: NumberInputProps) => {
  const { elementProps, onChange, value = "" } = props;

  // Format value to display with dots (e.g. 10.000.000)
  const formatValue = useCallback((val: number | string) => {
    if (!val) return "";
    return new Intl.NumberFormat("vi-VN").format(Number(val));
  }, []);

  // Handle input change
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.currentTarget.value;
      
      // Remove all non-numeric characters (dots, commas, spaces)
      const rawValue = inputValue.replace(/[^0-9]/g, "");
      
      // Convert to number
      const numberValue = rawValue ? Number(rawValue) : undefined;

      // Trigger the patch to update the document
      onChange(numberValue ? set(numberValue) : unset());
    },
    [onChange]
  );

  // Display value is the formatted version of the stored value
  // If user is typing, we might want to handle local state, but for simplicity
  // and consistency, we can rely on the prop value if updates are fast enough.
  // However, to support smooth typing, usually we just format the incoming value.
  const displayValue = useMemo(() => formatValue(value), [value, formatValue]);

  return (
    <Stack space={2}>
      <TextInput
        {...elementProps}
        value={displayValue}
        onChange={handleChange}
        placeholder="0"
      />
      <Text size={1} muted>
        Giá trị lưu trong database: {value}
      </Text>
    </Stack>
  );
};
