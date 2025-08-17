import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./ui";
import { Button } from "./ui";
import { Search } from "lucide-react";

function CommandSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  const searchItems = [
    {
      title: "Beranda",
      description: "Kembali ke halaman utama",
      onSelect: () => navigate("/"),
    },
    {
      title: "Kategori",
      description: "Jelajahi semua kategori",
      onSelect: () => navigate("/categories"),
    },
    {
      title: "Arduino Tutorial",
      description: "Cari tutorial Arduino",
      onSelect: () => navigate("/search?q=arduino"),
    },
    {
      title: "ESP32 Project",
      description: "Cari project ESP32",
      onSelect: () => navigate("/search?q=esp32"),
    },
    {
      title: "Raspberry Pi Guide",
      description: "Cari guide Raspberry Pi",
      onSelect: () => navigate("/search?q=raspberry+pi"),
    },
    {
      title: "IoT Basics",
      description: "Pelajari dasar-dasar IoT",
      onSelect: () => navigate("/search?q=iot"),
    },
  ];

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Cari tutorial, artikel, atau kategori...
        <CommandShortcut>⌘K</CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Ketik untuk mencari..." />
        <CommandList>
          <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
          <CommandGroup heading="Navigasi Cepat">
            {searchItems.map((item) => (
              <CommandItem
                key={item.title}
                onSelect={() => runCommand(item.onSelect)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandSearch;
