import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputNumber, Button } from "antd";
import { File } from "lucide-react";

interface AddAmountProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAmount({ isOpen, onClose }: AddAmountProps) {
  const [amount, setAmount] = useState<number | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold">
            إضافة مبلغ إلى العهدة المحددة
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            أدخل المبلغ المراد إضافته.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <InputNumber
            style={{ width: "100%" }}
            decimalSeparator="."
            placeholder="أدخل المبلغ"
            value={amount}
            onChange={setAmount}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            parser={(value) => Number(value?.replace(/,/g, ""))}
          />
        </div>

        <DialogFooter>
          <Button
            type="primary"
            className="cursor-pointer"
            onClick={() => {
              console.log("المبلغ المضاف:", amount);
              onClose();
            }}
            disabled={!amount}
          >
            <File size={18} />
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
