import React from 'react';
import { MapPin, Calendar, Clock, IndianRupee, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Timeline = ({ stops, activities, onAddActivity, onDeleteActivity, onDeleteStop }) => {
  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
  };
  if (stops.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-sky-light flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No itinerary yet</h3>
        <p className="text-muted-foreground">Start adding stops to build your timeline</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stops.map((stop, index) => (
        <div key={stop._id} className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          <div className="flex-1 p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">{stop.city}</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() => {
                    console.log('Add Activity button clicked for stop:', stop._id);
                    onAddActivity(stop._id);
                  }}
                >
                  <Plus className="w-3 h-3" />
                  Add Activity
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDeleteStop(stop._id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {formatDate(stop.startDate)} - {formatDate(stop.endDate)}
            </p>
            
            {/* Activities for this stop */}
            {console.log('Activities for stop', stop._id, ':', activities[stop._id])}
            {activities[stop._id] && activities[stop._id].length > 0 ? (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Activities ({activities[stop._id].length})
                </h4>
                <div className="space-y-2">
                {activities[stop._id].map((activity) => {
                  console.log('Rendering activity:', activity);
                  return (
                  <div key={activity._id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.activityName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {activity.cost && (
                          <>
                            <IndianRupee className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{activity.cost}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteActivity(activity._id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  );
                })}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-muted/30 rounded-md border border-dashed border-muted-foreground/20">
                <p className="text-sm text-muted-foreground italic text-center">
                  No activities planned yet
                </p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Click "Add Activity" to get started
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
