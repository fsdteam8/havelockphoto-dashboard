import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export type HavelockphotoDropDownSelectorType = {
  id: number;
  name: string;
  value: string | boolean | number | undefined;
};

const HavelockphotoDropDownSelector = ({
  list,
  selectedValue,
  onValueChange,
  placeholderText,
}: {
  list: HavelockphotoDropDownSelectorType[]; // List of items
  selectedValue: string | number; // Currently selected value
  onValueChange: (value: string | number) => void; // Function to handle value change
  placeholderText?: string;
}) => {
  return (
    <Select
      value={typeof selectedValue === "string" ? selectedValue : ""}
      onValueChange={(val) => onValueChange(val)} // Update the state on selection
    >
      <SelectTrigger className="h-[49px] w-[200px]  bg-white border border-[#E6E6E6] rounded-[8px] text-[#0E2A5C] text-base focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
        <SelectValue placeholder={placeholderText ?? selectedValue} />
      </SelectTrigger>
      <SelectContent className="w-fit *:p-0">
        <SelectGroup className="">
          {list.map((item) => (
            <SelectItem
              key={item.id}
              value={typeof item.value === "string" ? item.value : ""}
              className="text-[#0E2A5C] font-normal text-[16px] leading-normal"
            >
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default HavelockphotoDropDownSelector;
