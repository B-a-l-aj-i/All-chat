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
import { socket } from "../lib/socket";

export default function JoinRoom({
  onJoined,
}: {
  onJoined?: (roomId: string) => void;
}) {
  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const roomId = String(form.get("room_name"));
    if (!roomId) return;
    socket.emit("join-room", roomId);
    onJoined?.(roomId);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" className="rounded-3xl p-4 cursor-pointer">
            Join Room
          </Button>
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
