<cfcomponent rest="true" restPath="contato">  
    <cfprocessingDirective pageencoding="utf-8">
    <cfset setEncoding("form","utf-8")> 

	<cffunction name="hello" access="remote" returntype="String" httpmethod="GET"> 
        	
		<cfset response = structNew()>		
		
		<cftry>			
            <cfset response["message"] = "Serviço ativo">

			<cfcatch>
				<cfset responseError(400, cfcatch.message)>
			</cfcatch>
		</cftry>
		
		<cfreturn SerializeJSON(response)>
    </cffunction>

    <cffunction name="email" access="remote" returnType="String" httpMethod="POST">		
		<cfargument name="body" type="String">

		<cfset body = DeserializeJSON(arguments.body)>

        <cftry>		
			<cfset response = structNew()>			
            <cfset response["sucesss"] = true>

            <cfset _server = "smtp.office365.com">
            <cfset _username = "no-reply@guga-guincho.com.br">
            <cfset _password = "@KOS00IMSTech">            
            <cfset _port = 587>     

            <cfmail from="#_username#"
				type="html"
				to="contato@guga-guincho.com.br"
				bcc=""
				subject="[SITE guga-guincho] Contato"
		    	server="#_server#"
		    	username="#_username#" 
				password="#_password#"
				port="#_port#"		
				useTLS="true">

				<cfdump var="#body#">	
			</cfmail>

			<cfcatch>
				<cfthrow errorcode="400" message="#cfcatch.message#">
			</cfcatch>
		</cftry>

		<cfreturn SerializeJSON(response)>

    </cffunction>

</cfcomponent>