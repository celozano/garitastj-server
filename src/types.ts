export interface Port {
  border: string;
  commercial_automation_type: string;
  commercial_vehicle_lanes: any;
  crossing_name: string;
  date: string;
  hours: string;
  passenger_automation_type: string;
  passenger_vehicle_lanes: any;
  pedestrain_automation_type: string;
  pedestrian_lanes: any;
  port_name: string;
  port_number: string;
  port_status: string;
}

export interface BWT {
  border_wait_time: {
    last_updated_date: string;
    last_updated_time: string;
    number_of_ports: string;
    port: Array<Port>;
  };
}
