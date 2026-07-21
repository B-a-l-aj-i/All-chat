import { Button } from "@all-chat/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@all-chat/ui/components/dialog";
import { Field, FieldGroup } from "@all-chat/ui/components/field";
import { Input } from "@all-chat/ui/components/input";
import { Label } from "@all-chat/ui/components/label";
import { useJoinRoom } from "@/hooks/useJoinRoom";
import { USER_ID } from "@/constant";
import { UserRoundKey } from "lucide-react";

export default function JoinRoom({
  onJoined,
  showIcon = false,
}: {
  showIcon: boolean;
  onJoined?: (roomId: string) => void;
}) {
  const joinRoom = useJoinRoom();

  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const room_name = String(form.get("room_name"));
    const password = String(form.get("password"));

    joinRoom.mutate({
      room_name,
      password,
      user_id: USER_ID,
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          showIcon ? (
            <UserRoundKey
              size={21}
              className="text-[#777777] shrink-0 mr-[7.5px] cursor-pointer"
              strokeWidth={1.5}
            />
          ) : (
            <Button variant="ghost" className="rounded-3xl p-4 cursor-pointer">
              Join Room
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleJoinRoom}>
          <DialogHeader className="mb-2">
            <DialogTitle>Join Room</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Room Name</Label>
              <Input id="room_name" name="room_name" defaultValue="Room r" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Password</Label>
              <Input
                id="password"
                name="password"
                defaultValue="rumour rumour"
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            {/* <DialogClose render={<Button className="rounded-md cursor-pointer" variant="outline">Cancel</Button>} /> */}
            <Button className="rounded-md cursor-pointer" type="submit">
              Join
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
