import { useState } from 'react';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Alert from '../components/ui/Alert';
import { Dropdown, DropdownItem, DropdownSeparator } from '../components/ui/Dropdown';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, ModalCloseButton } from '../components/ui/Modal';
import FileUpload from '../components/ui/FileUpload';

const ComponentShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">UI Component Showcase</h1>
      
      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Buttons</h2>
        <Card>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="gradient">Gradient</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Button States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
                <Button glow>Glow Effect</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>This is a default card component</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the main content area of the card.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm" className="ml-2">Save</Button>
            </CardFooter>
          </Card>
          
          <Card variant="primary" hover>
            <CardHeader>
              <CardTitle>Primary Card with Hover</CardTitle>
              <CardDescription>This card has a primary style and hover effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the main content area of the card.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm" className="ml-2">Save</Button>
            </CardFooter>
          </Card>
          
          <Card variant="gradient" glassmorphism bordered>
            <CardHeader>
              <CardTitle>Gradient Glass Card</CardTitle>
              <CardDescription>This card has gradient, glass and border effects</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the main content area of the card.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm" className="ml-2">Save</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* Inputs Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Inputs</h2>
        <Card>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Input Variants</h3>
              <div className="grid gap-4">
                <Input placeholder="Default Input" />
                <Input variant="filled" placeholder="Filled Input" />
                <Input variant="outlined" placeholder="Outlined Input" />
                <Input variant="underlined" placeholder="Underlined Input" />
              </div>
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Input Sizes</h3>
              <div className="grid gap-4">
                <Input size="sm" placeholder="Small Input" />
                <Input size="md" placeholder="Medium Input" />
                <Input size="lg" placeholder="Large Input" />
              </div>
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Input States</h3>
              <div className="grid gap-4">
                <Input placeholder="Normal Input" />
                <Input disabled placeholder="Disabled Input" />
                <Input error="This field is required" placeholder="Error Input" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Badges Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Badges</h2>
        <Card>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Badge Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Badge Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Badge with Glow</h3>
              <div className="flex flex-wrap gap-4">
                <Badge variant="primary" glow>Glowing Badge</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Avatars Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Avatars</h2>
        <Card>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Avatar Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar size="xs" fallback="A" />
                <Avatar size="sm" fallback="B" />
                <Avatar size="md" fallback="C" />
                <Avatar size="lg" fallback="D" />
                <Avatar size="xl" fallback="E" />
                <Avatar size="2xl" fallback="F" />
              </div>
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Avatar with Status</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar fallback="A" status="online" />
                <Avatar fallback="B" status="offline" />
                <Avatar fallback="C" status="busy" />
                <Avatar fallback="D" status="away" />
              </div>
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Avatar Styles</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar fallback="A" />
                <Avatar fallback="B" bordered />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Alerts Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Alerts</h2>
        <div className="grid gap-4">
          <Alert variant="default" title="Default Alert">
            This is a default alert — check it out!
          </Alert>
          
          <Alert variant="info" title="Information">
            This is an info alert — check it out!
          </Alert>
          
          <Alert variant="success" title="Success">
            This is a success alert — check it out!
          </Alert>
          
          <Alert variant="warning" title="Warning">
            This is a warning alert — check it out!
          </Alert>
          
          <Alert variant="error" title="Error">
            This is an error alert — check it out!
          </Alert>
          
          <Alert 
            variant="info" 
            title="Dismissible Alert" 
            onClose={() => console.log('Alert closed')}
          >
            This alert can be dismissed by clicking the close button.
          </Alert>
        </div>
      </section>
      
      {/* Dropdowns Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Dropdowns</h2>
        <Card>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Basic Dropdown</h3>
              <Dropdown
                trigger={<Button>Open Dropdown</Button>}
              >
                <DropdownItem>Profile</DropdownItem>
                <DropdownItem>Settings</DropdownItem>
                <DropdownSeparator />
                <DropdownItem>Logout</DropdownItem>
              </Dropdown>
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Dropdown Alignment</h3>
              <div className="flex justify-between">
                <Dropdown
                  trigger={<Button>Left Aligned</Button>}
                  align="left"
                >
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                </Dropdown>
                
                <Dropdown
                  trigger={<Button>Center Aligned</Button>}
                  align="center"
                >
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                </Dropdown>
                
                <Dropdown
                  trigger={<Button>Right Aligned</Button>}
                  align="right"
                >
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                </Dropdown>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* File Upload Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">File Upload</h2>
        <Card>
          <CardContent className="grid gap-6">
            <div>
              <h3 className="mb-3 text-lg font-medium">Single File Upload</h3>
              <FileUpload
                label="Upload Profile Photo"
                accept="image/*"
                onChange={setSingleFile}
                value={singleFile ? [singleFile] : []}
                onRemove={() => setSingleFile(null)}
                multiple={false}
                variant="default"
              />
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Multiple File Upload</h3>
              <FileUpload
                label="Upload Documents"
                accept=".pdf,.doc,.docx,image/*"
                onChange={setMultipleFiles}
                value={multipleFiles}
                multiple={true}
                variant="filled"
              />
            </div>
            
            <div>
              <h3 className="mb-3 text-lg font-medium">Upload Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FileUpload
                  label="Default Style"
                  variant="default"
                  showPreview={false}
                />
                <FileUpload
                  label="Filled Style"
                  variant="filled"
                  showPreview={false}
                />
                <FileUpload
                  label="Outlined Style"
                  variant="outlined"
                  showPreview={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Modals Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Modals</h2>
        <Card>
          <CardContent>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            >
              <ModalHeader>
                <ModalTitle>Modal Title</ModalTitle>
                <ModalDescription>This is a description of the modal.</ModalDescription>
              </ModalHeader>
              <ModalCloseButton onClick={() => setIsModalOpen(false)} />
              <ModalBody>
                <p>This is the main content of the modal.</p>
                <p className="mt-4">You can put any content here.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsModalOpen(false)}>Continue</Button>
              </ModalFooter>
            </Modal>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ComponentShowcase;