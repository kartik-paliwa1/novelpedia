/**
 * Messages Header Component
 * 
 * Displays the main header for the messages page including:
 * - Page title and description
 * 
 * This component is purely presentational and receives its data via props.
 */

export function MessagesHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold gradient-heading">Messages & Notifications</h1>
        <p className="text-muted-foreground mt-1">Stay updated with your novel activity and platform updates</p>
      </div>
    </div>
  )
}
