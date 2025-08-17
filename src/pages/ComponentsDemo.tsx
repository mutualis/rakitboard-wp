import { useState } from "react";
import { Button } from "../components/ui";
import { Badge } from "../components/ui";
import { Input } from "../components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui";
import { Separator } from "../components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui";
import { Skeleton } from "../components/ui";
import CodeView from "@/pages/Post/components/CodeView";
import DataTable from "../components/DataTable.tsx";
import CommandSearch from "../components/CommandSearch.tsx";

// Sample data for DataTable
const sampleData = [
  {
    id: 1,
    name: "Arduino Uno",
    category: "Microcontroller",
    price: "$25",
    stock: 50,
  },
  {
    id: 2,
    name: "ESP32 DevKit",
    category: "WiFi Module",
    price: "$15",
    stock: 30,
  },
  {
    id: 3,
    name: "Raspberry Pi 4",
    category: "Single Board Computer",
    price: "$55",
    stock: 20,
  },
  { id: 4, name: "LED Strip", category: "Lighting", price: "$12", stock: 100 },
  { id: 5, name: "Servo Motor", category: "Motor", price: "$8", stock: 75 },
];

const columns = [
  { accessorKey: "name", header: "Nama Produk" },
  { accessorKey: "category", header: "Kategori" },
  { accessorKey: "price", header: "Harga" },
  { accessorKey: "stock", header: "Stok" },
];

function ComponentsDemo() {
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Komponen UI Demo
        </h1>
        <p className="text-lg text-gray-600">
          Demonstrasi semua komponen shadcn/ui yang tersedia
        </p>
      </div>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
          <Input
            placeholder="Placeholder text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input placeholder="Disabled input" disabled />
        </div>
      </section>

      {/* Select */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select</h2>
        <div className="max-w-md">
          <Select value={selectValue} onValueChange={setSelectValue}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arduino">Arduino</SelectItem>
              <SelectItem value="esp32">ESP32</SelectItem>
              <SelectItem value="raspberry-pi">Raspberry Pi</SelectItem>
              <SelectItem value="iot">IoT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>More content here.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Third Card</CardTitle>
              <CardDescription>Last example</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Final content example.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Separator */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Separator</h2>
        <div className="space-y-4">
          <p>Content above separator</p>
          <Separator />
          <p>Content below separator</p>
        </div>
      </section>

      {/* Avatar */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Avatar</h2>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/avatar-placeholder.png" alt="User" />
            <AvatarFallback>RB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      </section>

      {/* Accordion */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Accordion</h2>
        <div className="max-w-2xl">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Bagaimana cara menggunakan Arduino?
              </AccordionTrigger>
              <AccordionContent>
                Arduino adalah platform elektronik open-source yang mudah
                digunakan untuk membuat berbagai project elektronik.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Apa itu ESP32?</AccordionTrigger>
              <AccordionContent>
                ESP32 adalah microcontroller WiFi dan Bluetooth yang powerful
                untuk project IoT.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Raspberry Pi untuk apa?</AccordionTrigger>
              <AccordionContent>
                Raspberry Pi adalah komputer mini yang bisa digunakan untuk
                belajar programming, IoT, dan berbagai project kreatif.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Breadcrumb */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Breadcrumb</h2>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/categories">Kategori</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Arduino</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </section>

      {/* Table */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Table</h2>
        <div className="rounded-md border">
          <Table>
            <TableCaption>Daftar komponen elektronik</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* DataTable */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Advanced DataTable
        </h2>
        <DataTable
          columns={columns}
          data={sampleData}
          searchKey="name"
          searchPlaceholder="Cari produk..."
          pageSize={3}
        />
      </section>

      {/* Skeleton */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Skeleton Loading
        </h2>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </section>

      {/* CodeView */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Code View</h2>
        <CodeView
          code={`// Arduino LED Blink Example
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}`}
          language="arduino"
          title="LED Blink Example"
        />
      </section>

      {/* Command Search */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Command Search (Ctrl+K)
        </h2>
        <div className="max-w-md">
          <CommandSearch />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Tekan Ctrl+K (Windows/Linux) atau Cmd+K (Mac) untuk membuka search
        </p>
      </section>
    </div>
  );
}

export default ComponentsDemo;
