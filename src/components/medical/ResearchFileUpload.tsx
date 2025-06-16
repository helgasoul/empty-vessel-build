
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, Calendar, User, Building, Trash2, Download, Eye, Plus, X } from 'lucide-react';
import { useResearchFiles, ResearchFile } from '@/hooks/useResearchFiles';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const ResearchFileUpload = () => {
  const { files, loading, uploading, uploadFile, deleteFile, getFileUrl, updateFile } = useResearchFiles();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [researchType, setResearchType] = useState<ResearchFile['research_type']>('other');
  const [researchDate, setResearchDate] = useState('');
  const [labName, setLabName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const researchTypeLabels = {
    genetic: 'Генетические исследования',
    blood_test: 'Анализы крови',
    imaging: 'Медицинская визуализация',
    clinical_study: 'Клинические исследования',
    other: 'Другое'
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setResearchType('other');
    setResearchDate('');
    setLabName('');
    setDoctorName('');
    setTags([]);
    setNewTag('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.includes('pdf')) {
        alert('Поддерживаются только PDF файлы');
        return;
      }
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace('.pdf', ''));
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title || !researchDate) return;

    try {
      await uploadFile(selectedFile, {
        title,
        description,
        research_type: researchType,
        research_date: researchDate,
        lab_name: labName,
        doctor_name: doctorName,
        tags
      });

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      await deleteFile(fileId);
    }
  };

  const handleView = async (file: ResearchFile) => {
    const url = await getFileUrl(file.file_path);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleDownload = async (file: ResearchFile) => {
    const url = await getFileUrl(file.file_path);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-#F0A1C0">Файлы исследований</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-#F0A1C0 hover:bg-#F0A1C0/90" onClick={resetForm}>
              <Upload className="w-4 h-4 mr-2" />
              Загрузить файл
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Загрузка файла исследования</DialogTitle>
              <DialogDescription>
                Загрузите PDF файл с результатами исследований
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="file">PDF файл</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  required
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Выбран: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Название исследования"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Краткое описание исследования"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="researchType">Тип исследования</Label>
                  <Select value={researchType} onValueChange={(value: ResearchFile['research_type']) => setResearchType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(researchTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="researchDate">Дата исследования</Label>
                  <Input
                    id="researchDate"
                    type="date"
                    value={researchDate}
                    onChange={(e) => setResearchDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="labName">Лаборатория</Label>
                  <Input
                    id="labName"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    placeholder="Название лаборатории"
                  />
                </div>

                <div>
                  <Label htmlFor="doctorName">Врач</Label>
                  <Input
                    id="doctorName"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="ФИО врача"
                  />
                </div>
              </div>

              <div>
                <Label>Теги</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Добавить тег"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                        {tag} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={uploading || !selectedFile || !title || !researchDate}
                className="w-full bg-#F0A1C0 hover:bg-#F0A1C0/90"
              >
                {uploading ? 'Загрузка...' : 'Загрузить файл'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {files.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Нет загруженных файлов</h3>
            <p className="text-gray-600 mb-4">
              Загрузите свои первые файлы исследований для хранения и управления
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-#F0A1C0 hover:bg-#F0A1C0/90" onClick={resetForm}>
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить первый файл
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Загрузка файла исследования</DialogTitle>
                  <DialogDescription>
                    Загрузите PDF файл с результатами исследований
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="file">PDF файл</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      required
                    />
                    {selectedFile && (
                      <p className="text-sm text-gray-600 mt-1">
                        Выбран: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="title">Название</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Название исследования"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Краткое описание исследования"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="researchType">Тип исследования</Label>
                      <Select value={researchType} onValueChange={(value: ResearchFile['research_type']) => setResearchType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(researchTypeLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="researchDate">Дата исследования</Label>
                      <Input
                        id="researchDate"
                        type="date"
                        value={researchDate}
                        onChange={(e) => setResearchDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="labName">Лаборатория</Label>
                      <Input
                        id="labName"
                        value={labName}
                        onChange={(e) => setLabName(e.target.value)}
                        placeholder="Название лаборатории"
                      />
                    </div>

                    <div>
                      <Label htmlFor="doctorName">Врач</Label>
                      <Input
                        id="doctorName"
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                        placeholder="ФИО врача"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Теги</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Добавить тег"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                            {tag} <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={uploading || !selectedFile || !title || !researchDate}
                    className="w-full bg-#F0A1C0 hover:bg-#F0A1C0/90"
                  >
                    {uploading ? 'Загрузка...' : 'Загрузить файл'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map(file => (
            <Card key={file.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge className="bg-blue-100 text-blue-800">
                    {researchTypeLabels[file.research_type]}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleView(file)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDownload(file)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(file.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{file.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {file.description && (
                  <p className="text-sm text-gray-600 mb-3">{file.description}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(file.research_date), 'dd MMMM yyyy', { locale: ru })}
                  </div>
                  
                  {file.lab_name && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="w-4 h-4" />
                      {file.lab_name}
                    </div>
                  )}
                  
                  {file.doctor_name && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      {file.doctor_name}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    {(file.file_size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>

                {file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {file.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchFileUpload;
