import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const NatureSelect = ({
  value,
  onChange,
  placeholder,
}: Props) => {
  return (
    <>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[400px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {/* TODO: あとで修正 */}
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default NatureSelect;
