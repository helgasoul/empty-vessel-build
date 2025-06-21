
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const PasswordResetDialog = ({ open, onOpenChange, onSubmit, isLoading }: PasswordResetDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm text-purple-600 hover:text-purple-700 font-roboto">
          Забыли пароль?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-purple-600" />
            <span>Восстановление пароля</span>
          </DialogTitle>
          <DialogDescription>
            Введите ваш email адрес и мы отправим вам ссылку для восстановления пароля.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resetEmail" className="font-roboto">Email адрес</Label>
            <Input
              id="resetEmail"
              name="resetEmail"
              type="email"
              placeholder="your@email.com"
              required
              className="font-roboto"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full prevent-button-primary"
            disabled={isLoading}
          >
            {isLoading ? "Отправка..." : "Отправить ссылку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
