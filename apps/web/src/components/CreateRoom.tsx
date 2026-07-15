import { useCreateRoom } from "@/hooks/useCreateRoom";
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

export default function CreateRoom() {
  const createRoom = useCreateRoom();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    
    const formData = new FormData(e.currentTarget);
    // console.log(formData.get("room_name"));   // { room_name: "Room r", description: "...", password: "..." }

    createRoom.mutate({
      room_name: formData.get("room_name") as string,
      description: formData.get("description") as string,
      password: formData.get("password") as string,
    });
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="rounded-3xl p-4 cursor-pointer">
            Create Room
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Room Name</Label>
              <Input id="room_name" name="room_name" defaultValue="Room r" />
            </Field>
            <Field>
              <Label htmlFor="name-1">Room description</Label>
              <Input
                id="description"
                name="description"
                defaultValue="Room r is for rumour"
              />
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
          <DialogFooter>
            {/* <DialogClose render={<Button className="rounded-md cursor-pointer" variant="outline">Cancel</Button>} /> */}
            <Button className="rounded-md cursor-pointer" type="submit">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
