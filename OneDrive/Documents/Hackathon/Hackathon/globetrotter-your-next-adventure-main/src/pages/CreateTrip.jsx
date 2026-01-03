import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, FileText, ImagePlus, ArrowLeft, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const tripSchema = z.object({
  tripName: z.string().trim().min(3, "Trip name must be at least 3 characters").max(100, "Trip name is too long"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().max(500, "Description is too long").optional(),
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
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const result = tripSchema.safeParse({ tripName, startDate, endDate, description });
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsLoading(false);
    
    toast({
      title: "Trip Created! 🎉",
      description: `"${tripName}" has been added to your trips.`,
    });
    
    navigate("/trips");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>

          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Create New Trip
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to start planning your adventure
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Name */}
            <div className="card-travel p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-light flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Trip Name</h2>
                  <p className="text-sm text-muted-foreground">Give your trip a memorable name</p>
                </div>
              </div>
              <Input
                id="tripName"
                type="text"
                placeholder="e.g., Italian Summer Adventure"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className={`h-12 transition-all duration-200 ${errors.tripName ? "border-destructive ring-destructive/30 ring-2" : ""}`}
              />
              {errors.tripName && (
                <p className="text-sm text-destructive mt-2 animate-fade-in">{errors.tripName}</p>
              )}
            </div>

            {/* Dates */}
            <div className="card-travel p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Travel Dates</h2>
                  <p className="text-sm text-muted-foreground">When are you planning to travel?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`h-12 transition-all duration-200 ${errors.startDate ? "border-destructive ring-destructive/30 ring-2" : ""}`}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.startDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`h-12 transition-all duration-200 ${errors.endDate ? "border-destructive ring-destructive/30 ring-2" : ""}`}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card-travel p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Description</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your trip plans</p>
                </div>
              </div>
              <Textarea
                id="description"
                placeholder="Describe your trip, goals, or highlights you're excited about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`resize-none transition-all duration-200 ${errors.description ? "border-destructive ring-destructive/30 ring-2" : ""}`}
              />
              <div className="flex justify-between mt-2">
                {errors.description ? (
                  <p className="text-sm text-destructive animate-fade-in">{errors.description}</p>
                ) : (
                  <span />
                )}
                <span className={`text-sm ${description.length > 450 ? "text-accent" : "text-muted-foreground"}`}>
                  {description.length}/500
                </span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="card-travel p-6 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Cover Image</h2>
                  <p className="text-sm text-muted-foreground">Optional: Add a cover photo</p>
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary hover:bg-sky-light/30 transition-all duration-300 cursor-pointer group">
                <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-3 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="accent" size="lg" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Create Trip
                  </>
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
