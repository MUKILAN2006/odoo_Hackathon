import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, FileText, ImagePlus, ArrowLeft, Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { tripApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const tripSchema = z.object({
  tripName: z.string().trim().min(3, "Trip name must be at least 3 characters").max(100, "Trip name is too long"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().max(500, "Description is too long").optional(),
  coverImage: z.any().optional()
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

const CreateTrip = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Check if we're in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      loadTripData();
    }
  }, [id]);

  const loadTripData = async () => {
    try {
      setIsLoading(true);
      // For now, we'll need to fetch the trip data
      // You might need to add a getTripById function to the API
      console.log('Loading trip data for edit:', id);
      // TODO: Implement trip data loading
    } catch (error) {
      console.error('Error loading trip:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trip data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    reset
  } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      tripName: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('coverImage', {
          type: 'manual',
          message: 'Image size should be less than 5MB',
        });
        return;
      }
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create a trip',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('tripName', data.tripName);
      formData.append('startDate', data.startDate);
      formData.append('endDate', data.endDate);
      formData.append('description', data.description || '');

      if (!isEditMode) {
        formData.append('userId', user._id);
      }

      // Add cover image if exists
      const coverImageInput = document.getElementById('coverImage');
      if (coverImageInput && coverImageInput.files[0]) {
        console.log('Adding cover image:', coverImageInput.files[0]);
        formData.append('coverImage', coverImageInput.files[0]);
      } else {
        console.log('No cover image found');
      }

      let response;
      if (isEditMode) {
        response = await tripApi.updateTrip(id, formData);
        toast({
          title: 'Trip updated!',
          description: 'Your trip has been updated successfully.',
        });
      } else {
        response = await tripApi.createTrip(formData);
        toast({
          title: 'Trip created!',
          description: 'Your trip has been created successfully.',
        });
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving trip:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || `Failed to ${isEditMode ? 'update' : 'create'} trip`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-6"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? 'Edit Trip' : 'Create New Trip'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? 'Update your trip details' : 'Plan your next adventure with us'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Cover Image */}
            <div className="space-y-4">
              <Label htmlFor="coverImage">Cover Image</Label>
              <div className="flex items-center gap-4">
                <label 
                  htmlFor="coverImage"
                  className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary transition-colors flex items-center justify-center"
                >
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Trip cover preview"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Pencil className="h-6 w-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImagePlus className="h-8 w-8 mb-2" />
                      <span className="text-xs text-center">Add Cover</span>
                    </div>
                  )}
                </label>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a cover image for your trip (optional)
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...register('coverImage', {
                        onChange: handleImageChange,
                        validate: {
                          fileSize: (files) => {
                            if (!files?.[0]) return true;
                            return files[0].size <= 5 * 1024 * 1024 || 'File size should be less than 5MB';
                          },
                          fileType: (files) => {
                            if (!files?.[0]) return true;
                            return ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type) || 'Only JPG, PNG, and WebP images are allowed';
                          }
                        }
                      })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('coverImage').click()}
                      className="shrink-0"
                    >
                      {previewImage ? 'Change Image' : 'Select Image'}
                    </Button>
                    {previewImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPreviewImage(null);
                          // Reset the file input
                          const input = document.getElementById('coverImage');
                          if (input) input.value = '';
                        }}
                        className="text-destructive hover:text-destructive/90"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    JPG, PNG, or WebP. Max 5MB.
                  </p>
                  {errors.coverImage && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.coverImage.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Name */}
            <div className="space-y-2">
              <Label htmlFor="tripName" className="text-gray-700 font-medium">Trip Name</Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="tripName"
                  placeholder="e.g., Summer Vacation 2023"
                  className="pl-10 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={isLoading}
                  {...register('tripName')}
                />
              </div>
              {errors.tripName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tripName.message}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-gray-700 font-medium">Start Date</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="startDate"
                    type="date"
                    className="pl-10 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                    {...register('startDate')}
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-700 font-medium">End Date</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="endDate"
                    type="date"
                    className="pl-10 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isLoading || !startDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    {...register('endDate')}
                  />
                </div>
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
                <span className="text-xs text-gray-500">
                  {watch('description')?.length || 0}/500
                </span>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <Textarea
                  id="description"
                  placeholder="Tell us about your trip..."
                  className="min-h-[120px] pl-10 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={isLoading}
                  maxLength={500}
                  {...register('description')}
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditMode ? 'Update Trip' : 'Create Trip'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTrip;