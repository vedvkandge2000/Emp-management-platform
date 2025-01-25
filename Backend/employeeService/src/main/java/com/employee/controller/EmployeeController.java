package com.employee.controller;

import com.employee.entity.Employee;
import com.employee.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(maxAge = 3600)
@RestController
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/employee/{empId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable("empId") Long empId) {
        return ResponseEntity.ok(employeeService.getEmployeeById(empId));
    }

    @PostMapping("/employees")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        return ResponseEntity.ok(employeeService.addEmployee(employee));
    }

    @PatchMapping("employees/{empId}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable("empId") Long empId, @RequestBody Employee employee) {
        Employee empObj = employeeService.getEmployeeById(empId);
        if(empObj == null){
            return ResponseEntity.notFound().build();
        }
        empObj.setManagerName(employee.getManagerName());
        empObj.setFirstName(employee.getFirstName());
        empObj.setLastName(employee.getLastName());
        empObj.setSalary(employee.getSalary());
        return ResponseEntity.ok(employeeService.updateEmployee(employee));
    }

    @DeleteMapping("/employee/{empId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable("empId") Long empId) {
        Employee employee = employeeService.getEmployeeById(empId);
        if(employee == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(employeeService.deleteEmployee(employee));
    }
}
