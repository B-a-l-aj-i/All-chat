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
          <DialogHeader className="mb-2">
            <DialogTitle>Create Room</DialogTitle>
            <DialogDescription>
              <span className="text-red-700">
                {createRoom.isError && createRoom.error.message}
              </span>
              <span className="text-green-700">
                {createRoom.isSuccess && "Room Created Successfully"}
              </span>
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
          <DialogFooter className="mt-4">
            {/* <DialogClose render={<Button className="rounded-md cursor-pointer" variant="outline">Cancel</Button>} /> */}
            <Button
              disabled={createRoom.isPending}
              className={"rounded-md cursor-pointer"}
              type="submit"
            >
              {createRoom.isPending && "Creating..."}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
