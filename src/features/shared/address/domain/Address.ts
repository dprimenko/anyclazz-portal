import type { GeoPoint } from '../../geopoint/domain/GeoPoint'

export interface Address {
    address: string
    geoPoint: GeoPoint,
    distance?: number
}
